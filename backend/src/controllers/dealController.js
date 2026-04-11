const mongoose = require("mongoose");
const Contact = require("../models/Contact");
const Deal = require("../models/Deal");

const STAGES = ["Lead", "Contacted", "Proposal", "Won", "Lost"];

const isValidObjectId = (value) =>
  Boolean(value) && mongoose.Types.ObjectId.isValid(value);

const toContactMap = (contacts = []) =>
  contacts.reduce((acc, contact) => {
    acc[contact._id.toString()] = {
      _id: contact._id.toString(),
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      organizationId: contact.organizationId || "",
      company: contact.company || "",
      status: contact.status || "lead",
    };
    return acc;
  }, {});

const buildDealPayload = (deal, contactMap = {}) => ({
  ...deal,
  contactId: deal.contactId || "",
  contact:
    deal.contactId && contactMap[deal.contactId]
      ? contactMap[deal.contactId]
      : null,
});

exports.getDealMetadata = async (req, res) => {
  try {
    const contacts = await Contact.find(
      {},
      "firstName lastName email company status",
    )
      .sort({ firstName: 1, lastName: 1 })
      .lean();

    const assignees = Array.from(
      new Set(
        (await Deal.distinct("assignedTo"))
          .map((value) => value?.toString().trim())
          .filter(Boolean),
      ),
    ).sort((left, right) => left.localeCompare(right));

    res.status(200).json({
      success: true,
      stages: STAGES,
      contacts: contacts.map((contact) => ({
        _id: contact._id.toString(),
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        company: contact.company || "",
        status: contact.status || "lead",
      })),
      assignees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getAllDeals = async (req, res) => {
  try {
    const stage = req.query.stage ? req.query.stage.toString().trim() : "";
    const assignedTo = req.query.assignedTo
      ? req.query.assignedTo.toString().trim()
      : "";
    const search = req.query.search ? req.query.search.toString().trim() : "";
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

    const filter = {};

    if (stage) {
      filter.stage = stage;
    }

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = startDate;
      if (endDate) filter.createdAt.$lte = endDate;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      const matchingContacts = await Contact.find(
        {
          $or: [
            { firstName: regex },
            { lastName: regex },
            { email: regex },
            { company: regex },
          ],
        },
        "_id",
      ).lean();
      const matchingContactIds = matchingContacts.map((contact) =>
        contact._id.toString(),
      );

      filter.$or = [
        { title: regex },
        { assignedTo: regex },
        ...(matchingContactIds.length
          ? [{ contactId: { $in: matchingContactIds } }]
          : []),
      ];
    }

    const deals = await Deal.find(filter).sort({ updatedAt: -1 }).lean();

    const contactIds = deals
      .map((deal) => deal.contactId)
      .filter(
        (value, index, array) =>
          isValidObjectId(value) && array.indexOf(value) === index,
      );
    const contacts = contactIds.length
      ? await Contact.find(
          { _id: { $in: contactIds } },
          "firstName lastName email organizationId company status",
        ).lean()
      : [];
    const contactMap = toContactMap(contacts);

    const stageCounts = STAGES.reduce((acc, currentStage) => {
      acc[currentStage] = 0;
      return acc;
    }, {});

    deals.forEach((deal) => {
      stageCounts[deal.stage] = (stageCounts[deal.stage] || 0) + 1;
    });

    const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

    res.status(200).json({
      success: true,
      count: deals.length,
      totalValue,
      stageCounts,
      stages: STAGES,
      data: deals.map((deal) => buildDealPayload(deal, contactMap)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id).lean();

    if (!deal) {
      return res.status(404).json({
        success: false,
        error: "Deal not found",
      });
    }

    const contact = isValidObjectId(deal.contactId)
      ? await Contact.findById(
          deal.contactId,
          "firstName lastName email organizationId company status",
        ).lean()
      : null;

    res.status(200).json({
      success: true,
      data: buildDealPayload(deal, contact ? toContactMap([contact]) : {}),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.createDeal = async (req, res) => {
  try {
    const contactId = req.body.contactId
      ? req.body.contactId.toString().trim()
      : "";

    if (!isValidObjectId(contactId)) {
      return res.status(400).json({
        success: false,
        error: "Selected contact does not exist",
      });
    }

    const contact = await Contact.findById(contactId).lean();

    if (!contact) {
      return res.status(400).json({
        success: false,
        error: "Selected contact does not exist",
      });
    }

    const deal = await Deal.create({
      ...req.body,
      contactId,
    });

    res.status(201).json({
      success: true,
      data: buildDealPayload(deal.toObject(), toContactMap([contact])),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updateDeal = async (req, res) => {
  try {
    const contactId = req.body.contactId
      ? req.body.contactId.toString().trim()
      : "";

    if (!isValidObjectId(contactId)) {
      return res.status(400).json({
        success: false,
        error: "Selected contact does not exist",
      });
    }

    const contact = await Contact.findById(contactId).lean();

    if (!contact) {
      return res.status(400).json({
        success: false,
        error: "Selected contact does not exist",
      });
    }

    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        contactId,
      },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (!deal) {
      return res.status(404).json({
        success: false,
        error: "Deal not found",
      });
    }

    res.status(200).json({
      success: true,
      data: buildDealPayload(deal, toContactMap([contact])),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        error: "Deal not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
