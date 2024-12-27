import asyncHandler from "../middleware/asyncHandler.js";
import Visit from "../models/visitModel.js";

// Route to get monthly visits
const monthlyVisit = asyncHandler(async (req, res) => {
  try {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1
    );

    const totalVisits = await Visit.countDocuments({
      timestamp: { $gte: startOfMonth, $lt: endOfMonth },
    });

    res.json({ totalVisits });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ message: "Error fetching analytics" });
  }
});

export { monthlyVisit };
