const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// serve static files
app.use(express.static(path.join(__dirname, "public")));

// home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// return music list as json
app.get("/api/music", (req, res) => {
  const musicDir = path.join(__dirname, "public", "music");
  fs.readdir(musicDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "music folder could not be read." });
    }
    const musicFiles = files.filter(file => /\.(mp3|wav|flac)$/i.test(file));
    const musicList = musicFiles.map(file => ({
      file,
      title: path.parse(file).name.replace(/_/g, " ")
    }));
    res.json(musicList);
  });
});

// return background images as json
app.get("/api/backgrounds", (req, res) => {
  const imagesDir = path.join(__dirname, "public", "images");
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "images folder could not be read." });
    }
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    const imageList = imageFiles.map(file => `images/${file}`);
    res.json(imageList);
  });
});

// start the server
app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
