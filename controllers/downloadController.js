const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");


// Paths (relative to this controller)
const ytDlpPath = path.join(__dirname, "../bin/yt-dlp.exe");
const ffmpegPath = path.join(__dirname, "../bin/ffmpeg.exe");


// Make sure downloads folder exists
const downloadDir = path.join(__dirname, "../downloads");
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

// Helper: get latest downloaded file
function getLatestFile(dir) {
  const files = fs.readdirSync(dir);
  if (!files.length) return null;
  return path.join(
    dir,
    files.sort(
      (a, b) =>
        fs.statSync(path.join(dir, b)).mtimeMs -
        fs.statSync(path.join(dir, a)).mtimeMs
    )[0]
  );
}

// ------------------- MP3 -------------------
function downloadMP3(req, res) {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).send("❌ No URL provided");

  const output = path.join(downloadDir, "%(title)s.%(ext)s");

  const command = `"${ytDlpPath}" -f bestaudio[ext=m4a]/bestaudio --extract-audio --audio-format mp3 --ffmpeg-location "${ffmpegPath}" -o "${output}" "${videoUrl}"`;

  console.log("👉 Running command:", command);

  exec(command, (error, stdout, stderr) => {
    console.log("STDOUT:", stdout);
    console.log("STDERR:", stderr);

    if (error) {
      console.error("❌ ERROR object:", error);
      return res.status(500).send("Failed to download MP3");
    }

    const latestFile = getLatestFile(downloadDir);
    if (!latestFile) return res.status(500).send("File not found");

    res.download(latestFile);
  });
}


// ------------------- MP4 -------------------

function downloadMP4(req, res) {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).send("❌ No URL provided");

  const output = path.join(downloadDir, "%(title)s.%(ext)s");

  const command = `"${ytDlpPath}" -f "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/mp4" --merge-output-format mp4 --ffmpeg-location "${ffmpegPath}" -o "${output}" "${videoUrl}"`;

  console.log("👉 Running command:", command);

  exec(command, (error, stdout, stderr) => {
    console.log("STDOUT:", stdout);
    console.log("STDERR:", stderr);

    if (error) {
      console.error("❌ ERROR object:", error);
      return res.status(500).send("Failed to download MP4");
    }

    const latestFile = getLatestFile(downloadDir);
    if (!latestFile) return res.status(500).send("File not found");

    res.download(latestFile);
  });
}


// ✅ Proper export
module.exports = {
  downloadMP3,
  downloadMP4,
};
