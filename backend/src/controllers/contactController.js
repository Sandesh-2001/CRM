const Contact = require("../models/Contact");
const Organization = require("../models/Organization");
const mongoose = require("mongoose");

const toOrganizationMap = (organizations = []) =>
  organizations.reduce((acc, organization) => {
    acc[organization._id.toString()] = {
      _id: organization._id.toString(),
      name: organization.name,
      address: organization.address,
      industry: organization.industry,
    };
    return acc;
  }, {});

const buildContactPayload = (contact, organizationMap = {}) => {
  const organization =
    contact.organizationId && organizationMap[contact.organizationId]
      ? organizationMap[contact.organizationId]
      : null;

  return {
    ...contact,
    organizationId: contact.organizationId || "",
    organization,
  };
};

const isValidOrganizationId = (value) =>
  Boolean(value) && mongoose.Types.ObjectId.isValid(value);

// Get all contacts with pagination, search, and filters
exports.getAllContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search ? req.query.search.toString().trim() : "";
    const status = req.query.status ? req.query.status.toString().trim() : "";
    const organization = req.query.organization
      ? req.query.organization.toString().trim()
      : "";
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

    const filter = {};
    if (search) {
      const regex = new RegExp(search, "i");
      const matchingOrganizations = await Organization.find(
        {
          $or: [{ name: regex }, { industry: regex }],
        },
        "_id",
      ).lean();
      const organizationIds = matchingOrganizations.map((organization) =>
        organization._id.toString(),
      );

      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { phone: regex },
        { company: regex },
        ...(organizationIds.length
          ? [{ organizationId: { $in: organizationIds } }]
          : []),
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (organization) {
      filter.organizationId = organization;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = startDate;
      if (endDate) filter.createdAt.$lte = endDate;
    }

    const total = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const organizationIds = contacts
      .map((contact) => contact.organizationId)
      .filter(
        (value, index, array) =>
          isValidOrganizationId(value) && array.indexOf(value) === index,
      );
    const linkedOrganizations = organizationIds.length
      ? await Organization.find(
          { _id: { $in: organizationIds } },
          "name address industry",
        ).lean()
      : [];
    const organizationMap = toOrganizationMap(linkedOrganizations);

    const statusCountsResults = await Contact.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $ifNull: ["$status", "lead"] },
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = statusCountsResults.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const organizations = await Organization.find({}, "name address industry")
      .sort({ name: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      statusCounts,
      organizations,
      data: contacts.map((contact) =>
        buildContactPayload(contact, organizationMap),
      ),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get single contact
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).lean();

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: "Contact not found",
      });
    }

    const organization = isValidOrganizationId(contact.organizationId)
      ? await Organization.findById(
          contact.organizationId,
          "name address industry",
        ).lean()
      : null;

    res.status(200).json({
      success: true,
      data: buildContactPayload(
        contact,
        organization ? toOrganizationMap([organization]) : {},
      ),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Create contact
exports.createContact = async (req, res) => {
  try {
    const organizationId = req.body.organizationId
      ? req.body.organizationId.toString().trim()
      : "";

    if (organizationId) {
      if (!isValidOrganizationId(organizationId)) {
        return res.status(400).json({
          success: false,
          error: "Selected organization does not exist",
        });
      }

      const organization = await Organization.findById(organizationId);

      if (!organization) {
        return res.status(400).json({
          success: false,
          error: "Selected organization does not exist",
        });
      }
    }

    const contact = await Contact.create({
      ...req.body,
      organizationId,
    });
    const organization = isValidOrganizationId(organizationId)
      ? await Organization.findById(
          organizationId,
          "name address industry",
        ).lean()
      : null;

    res.status(201).json({
      success: true,
      data: buildContactPayload(
        contact.toObject(),
        organization ? toOrganizationMap([organization]) : {},
      ),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update contact
exports.updateContact = async (req, res) => {
  try {
    const organizationId = req.body.organizationId
      ? req.body.organizationId.toString().trim()
      : "";

    if (organizationId) {
      if (!isValidOrganizationId(organizationId)) {
        return res.status(400).json({
          success: false,
          error: "Selected organization does not exist",
        });
      }

      const organization = await Organization.findById(organizationId);

      if (!organization) {
        return res.status(400).json({
          success: false,
          error: "Selected organization does not exist",
        });
      }
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        organizationId,
      },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: "Contact not found",
      });
    }

    const organization = isValidOrganizationId(organizationId)
      ? await Organization.findById(
          organizationId,
          "name address industry",
        ).lean()
      : null;

    res.status(200).json({
      success: true,
      data: buildContactPayload(
        contact,
        organization ? toOrganizationMap([organization]) : {},
      ),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: "Contact not found",
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
