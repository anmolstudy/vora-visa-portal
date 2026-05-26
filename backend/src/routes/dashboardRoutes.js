import express from "express";
import Demand from "../models/Demand.js";
import Contact from "../models/Contact.js";

const router = express.Router();

// GET Dashboard Stats
router.get("/stats", async (req, res) => {
  try {
    // Total counts
    const totalDemands = await Demand.countDocuments();
    const totalContacts = await Contact.countDocuments();

    // Today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Today's data
    const todayDemands = await Demand.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const todayContacts = await Contact.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    res.status(200).json({
      totalDemands,
      totalContacts,
      todayDemands,
      todayContacts,
    });
  } catch (error) {
    console.error("Dashboard Error:", error.message);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

export default router;
