import Event from "../models/events.model.js";

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    if (!events) return res.status(400).json({ message: "No Events, Please create one." });

    res.status(201).json({ 
      message: "Retrieved Events successfully",
      events
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


