const Contact = require("../models/Contact");
const Organization = require("../models/Organization");

exports.getAllOrganizations = async (req, res) => {
  try {
    const search = req.query.search ? req.query.search.toString().trim() : "";
    const industry = req.query.industry
      ? req.query.industry.toString().trim()
      : "";
    const filter = {};

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { address: regex }, { industry: regex }];
    }

    if (industry) {
      filter.industry = industry;
    }

    const organizations = await Organization.find(filter)
      .sort({ name: 1 })
      .lean();

    const organizationIds = organizations.map((organization) =>
      organization._id.toString(),
    );
    const counts = await Contact.aggregate([
      {
        $match: {
          organizationId: { $in: organizationIds },
        },
      },
      {
        $group: {
          _id: "$organizationId",
          count: { $sum: 1 },
        },
      },
    ]);

    const contactCounts = counts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    const data = organizations.map((organization) => ({
      ...organization,
      contactCount: contactCounts[organization._id.toString()] || 0,
    }));

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id).lean();

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: "Organization not found",
      });
    }

    const contactCount = await Contact.countDocuments({
      organizationId: organization._id.toString(),
    });

    res.status(200).json({
      success: true,
      data: {
        ...organization,
        contactCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.createOrganization = async (req, res) => {
  try {
    const organization = await Organization.create(req.body);

    res.status(201).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: "Organization not found",
      });
    }

    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteOrganization = async (req, res) => {
  try {
    const linkedContacts = await Contact.countDocuments({
      organizationId: req.params.id.toString(),
    });

    if (linkedContacts > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete an organization that is linked to contacts",
      });
    }

    const organization = await Organization.findByIdAndDelete(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: "Organization not found",
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
