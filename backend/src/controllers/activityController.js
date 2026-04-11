const mongoose = require("mongoose");
const Activity = require("../models/Activity");
const Contact = require("../models/Contact");
const Deal = require("../models/Deal");

const isValidObjectId = (value) =>
  Boolean(value) && mongoose.Types.ObjectId.isValid(value);

const toRelatedSummary = (entityType, entity) => {
  if (!entity) {
    return null;
  }

  if (entityType === "contact") {
    return {
      entityType,
      entityId: entity._id.toString(),
      label: `${entity.firstName || ""} ${entity.lastName || ""}`.trim() || entity.email,
      sublabel: entity.email,
    };
  }

  return {
    entityType,
    entityId: entity._id.toString(),
    label: entity.title,
    sublabel: entity.stage,
  };
};

const hydrateActivity = async (activity) => {
  const entityType = activity.relatedTo?.entityType;
  const entityId = activity.relatedTo?.entityId;

  if (!entityType || !entityId || !isValidObjectId(entityId)) {
    return {
      ...activity,
      relatedEntity: null,
    };
  }

  if (entityType === "contact") {
    const contact = await Contact.findById(
      entityId,
      "firstName lastName email",
    ).lean();

    return {
      ...activity,
      relatedEntity: toRelatedSummary(entityType, contact),
    };
  }

  const deal = await Deal.findById(entityId, "title stage").lean();

  return {
    ...activity,
    relatedEntity: toRelatedSummary(entityType, deal),
  };
};

const validateRelatedEntity = async (entityType, entityId) => {
  if (!["contact", "deal"].includes(entityType) || !isValidObjectId(entityId)) {
    return false;
  }

  if (entityType === "contact") {
    return Boolean(await Contact.exists({ _id: entityId }));
  }

  return Boolean(await Deal.exists({ _id: entityId }));
};

exports.getActivityMeta = async (req, res) => {
  try {
    const [contacts, deals] = await Promise.all([
      Contact.find({}, "firstName lastName email").sort({ firstName: 1 }).lean(),
      Deal.find({}, "title stage").sort({ updatedAt: -1 }).lean(),
    ]);

    res.status(200).json({
      success: true,
      contacts: contacts.map((contact) => ({
        _id: contact._id.toString(),
        label:
          `${contact.firstName || ""} ${contact.lastName || ""}`.trim() ||
          contact.email,
        sublabel: contact.email,
      })),
      deals: deals.map((deal) => ({
        _id: deal._id.toString(),
        label: deal.title,
        sublabel: deal.stage,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getAllActivities = async (req, res) => {
  try {
    const filter = {};
    const status = req.query.status ? req.query.status.toString().trim() : "";
    const type = req.query.type ? req.query.type.toString().trim() : "";

    if (status) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    const activities = await Activity.find(filter).sort({ date: 1, createdAt: -1 }).lean();
    const hydrated = await Promise.all(activities.map(hydrateActivity));

    res.status(200).json({
      success: true,
      count: hydrated.length,
      data: hydrated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).lean();

    if (!activity) {
      return res.status(404).json({
        success: false,
        error: "Activity not found",
      });
    }

    res.status(200).json({
      success: true,
      data: await hydrateActivity(activity),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.createActivity = async (req, res) => {
  try {
    const entityType = req.body.relatedTo?.entityType?.toString().trim();
    const entityId = req.body.relatedTo?.entityId?.toString().trim();

    if (!(await validateRelatedEntity(entityType, entityId))) {
      return res.status(400).json({
        success: false,
        error: "Selected related record does not exist",
      });
    }

    const activity = await Activity.create({
      ...req.body,
      relatedTo: {
        entityType,
        entityId,
      },
    });

    res.status(201).json({
      success: true,
      data: await hydrateActivity(activity.toObject()),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updateActivity = async (req, res) => {
  try {
    const entityType = req.body.relatedTo?.entityType?.toString().trim();
    const entityId = req.body.relatedTo?.entityId?.toString().trim();

    if (!(await validateRelatedEntity(entityType, entityId))) {
      return res.status(400).json({
        success: false,
        error: "Selected related record does not exist",
      });
    }

    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        relatedTo: {
          entityType,
          entityId,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (!activity) {
      return res.status(404).json({
        success: false,
        error: "Activity not found",
      });
    }

    res.status(200).json({
      success: true,
      data: await hydrateActivity(activity),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.markActivityCompleted = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true, runValidators: true },
    ).lean();

    if (!activity) {
      return res.status(404).json({
        success: false,
        error: "Activity not found",
      });
    }

    res.status(200).json({
      success: true,
      data: await hydrateActivity(activity),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        error: "Activity not found",
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
