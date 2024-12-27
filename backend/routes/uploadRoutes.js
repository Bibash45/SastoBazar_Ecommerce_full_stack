import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // Set the upload directory
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}` // Unique filename
    );
  },
});

// File filter to validate image types
function fileFilter(req, file, cb) {
  if (!file || !file.originalname) {
    return cb(new Error("File is missing or invalid."), false);
  }

  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Image only!"), false);
  }
}

// Multer instance
const upload = multer({
  storage,
  fileFilter,
});

// Route to handle multiple image uploads
router.post("/", (req, res) => {
  const uploadMultipleImages = upload.array("images", 5); // 'images' is the field name, max 10 files
  uploadMultipleImages(req, res, function (err) {
    if (err) {
      return res
        .status(400)
        .json({ message: err.message || "Image upload failed" });
    }

    // Construct paths for all uploaded images
    const imagePaths = req.files.map((file) => file.path);

    res.status(200).send({
      message: "Images uploaded successfully",
      images: imagePaths,
    });
  });
});

export default router;
