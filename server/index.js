const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const app = express();
const PORT = 3000;

mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/userform", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  file: Buffer,
  fileType: String,
});
const User = mongoose.model("User", userSchema); // ✅ Fix added

app.use(cors());
app.use(express.static('public')); // Make sure 'public/' is in correct dir

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/submit", upload.single("image"), async (req, res) => {
  const { name, email } = req.body;
  const imageBuffer = req.file.buffer;
  const imageType = req.file.mimetype;

  try {
    const user = new User({
      name,
      email,
      file: imageBuffer,
      fileType: imageType,
    });

    await user.save();
    res.send(`<h2>Thanks ${name}, your data with image was saved!</h2>`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving user.");
  }
});

app.get("/image/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // ✅ Corrected
    if (!user || !user.file) return res.status(404).send("Image not found");

    res.set("Content-Type", user.fileType);
    res.send(user.file);
  } catch (err) {
    res.status(500).send("Error fetching image");
  }
});

app.get("/users", async (req, res) => {
  const users = await User.find(); // ✅ Corrected
  let html = "<h2>All Users</h2>";

  users.forEach(user => {
    html += `
      <div style="margin-bottom:20px;background-color:black;color:white;padding:10px;">
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <img src="/image/${user._id}" width="150" style="border:1px solid #ccc;" />
      </div>
    `;
  });

  res.send(html);
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
