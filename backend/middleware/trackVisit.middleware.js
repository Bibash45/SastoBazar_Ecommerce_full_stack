import Visit from "../models/visitModel.js";

const trackVisit = async (req, res, next) => {
  try {
    const newVisit = new Visit({ page: req.path }); // Logs the page being visited
    await newVisit.save(); // Save visit to database
    console.log(`Visit logged for page: ${req.path}`);
  } catch (err) {
    console.error("Error logging visit:", err);
  }
  next();
};

export default trackVisit;
