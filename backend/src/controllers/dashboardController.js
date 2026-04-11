// Dummy dashboard controller for the CRM dashboard page
exports.getDashboardSummary = async (req, res) => {
  const summary = {
    totalDeals: 184,
    wonDeals: 123,
    lostDeals: 61,
    totalRevenue: 214800,
    monthlyRevenue: [
      { month: "Jan", value: 18200 },
      { month: "Feb", value: 19700 },
      { month: "Mar", value: 21400 },
      { month: "Apr", value: 22500 },
      { month: "May", value: 23800 },
      { month: "Jun", value: 25100 },
    ],
    wonRate: 67,
    lostRate: 33,
  };

  res.status(200).json({
    success: true,
    data: summary,
  });
};
