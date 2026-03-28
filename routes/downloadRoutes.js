const express = require("express");
const router = express.Router();
const { downloadMP3, downloadMP4 } = require("../controllers/downloadController");

// ✅ Make sure both functions exist
if (typeof downloadMP3 !== "function" || typeof downloadMP4 !== "function") {
  console.error("❌ Controller functions not found!");
}

router.get("/mp3", downloadMP3);
router.get("/mp4", downloadMP4);

module.exports = router;
