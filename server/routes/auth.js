const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const DSAProgress = require("../models/DSAProgress"); // ✅ CORRECTED
const authMiddleware = require("../middleware/authMiddleware");
const Project=require("../models/Project")
const ResumeModel=require("../models/ResumeModel")
const Resource = require("../models/Resource");
const InterviewModel=require("../models/InterviewExperience")
const Video = require("../models/Video");


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Please fill in all fields." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login successful",
        user: { id: user._id, name: user.name, email: user.email },
      });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: "User registered successfully",
        user: { name: newUser.name, email: newUser.email },
      });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET USER PROFILE
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// DSA profile
router.get("/dsa", authMiddleware, async (req, res) => {
    console.log('dsa route hit');
  try {
    console.log("DSA GET - Authenticated User ID:", req.user.id);

    let progress = await DSAProgress.findOne({ userId: req.user.id });
    console.log("Existing progress:", progress);

    if (!progress) {
      console.log("No existing progress. Creating...");
      progress = await DSAProgress.create({
        userId: req.user.id,
        unsolved: [
          "Longest Substring Without Repeating Characters",
          "Binary Tree Level Order Traversal",
          "Trapping Rain Water",
          "Word Ladder",
          "Course Schedule",
          "Merge Intervals",
          "Subsets II",
          "Kth Largest Element in an Array",
          "LRU Cache",
          "Coin Change",
          "Regular Expression Matching",
          "Find Median from Data Stream",
        ],
        solved: [],
      });
    }

    console.log("Final DSA progress returned:", progress);
    res.status(200).json(progress);
  } catch (err) {
    console.error("Fetch DSA error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/dsa/solve", authMiddleware, async (req, res) => {
  const { question } = req.body;

  try {
    const progress = await DSAProgress.findOne({ userId: req.user.id });

    if (!progress.solved.includes(question)) {
      progress.unsolved = progress.unsolved.filter((q) => q !== question);
      progress.solved.push(question);
      await progress.save();
    }

    res.status(200).json(progress);
  } catch (err) {
    console.error("Solve error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/dsa/unsolve", authMiddleware, async (req, res) => {
  const { question } = req.body;

  try {
    const progress = await DSAProgress.findOne({ userId: req.user.id });

    if (!progress.unsolved.includes(question)) {
      progress.solved = progress.solved.filter((q) => q !== question);
      progress.unsolved.push(question);
      await progress.save();
    }

    res.status(200).json(progress);
  } catch (err) {
    console.error("Unsolve error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Projects 

router.get("/projects", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error("Fetch projects error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new project (authenticated user)
router.post("/projects", authMiddleware, async (req, res) => {
  try {
    const { name, author, github, description } = req.body;
    if (!name || !author || !github || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newProject = await Project.create({
      userId: req.user.id,
      name,
      author,
      github,
      description,
    });
    res.status(201).json(newProject);
  } catch (err) {
    console.error("Add project error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Resume routes

// GET resumes

router.get("/resumes", authMiddleware, async (req, res) => {
  const all = await ResumeModel.find().lean();
  // mark which is mine
  const withFlag = all.map((r) => ({
    ...r,
    isMine: r.userId.toString() === req.user.id,
  }));
  res.json(withFlag);
});

// POST create resume
router.post("/resumes", authMiddleware, async (req, res) => {
  // ensure user has none existing
  await ResumeModel.deleteOne({ userId: req.user.id });
  const created = await ResumeModel.create({
    userId: req.user.id,
    name: req.body.name,
    file: req.body.file,
  });
  res.status(201).json(created);
});

// PUT update my resume
router.put("/resumes/:id", authMiddleware, async (req, res) => {
  const updated = await ResumeModel.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { name: req.body.name, file: req.body.file },
    { new: true }
  );
  res.json(updated);
});

router.get("/dsa/daily", authMiddleware, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    let progress = await DSAProgress.findOne({ userId: req.user.id });

    if (!progress) {
      progress = await DSAProgress.create({
        userId: req.user.id,
        unsolved: [
          "Longest Substring Without Repeating Characters",
          "Binary Tree Level Order Traversal",
          "Trapping Rain Water",
          "Word Ladder",
          "Course Schedule",
          "Merge Intervals",
          "Subsets II",
          "Kth Largest Element in an Array",
          "LRU Cache",
          "Coin Change",
          "Regular Expression Matching",
          "Find Median from Data Stream",
        ],
        solved: [],
        dailyLog: [],
      });
    }

    // Check if today's challenge already picked
    let todayEntry = progress.dailyLog.find((entry) => entry.date === today);

    if (!todayEntry) {
      const questionPool = [...progress.unsolved, ...progress.solved];
      const randomQuestion =
        questionPool[Math.floor(Math.random() * questionPool.length)];

      todayEntry = {
        date: today,
        question: randomQuestion,
      };

      progress.dailyLog.unshift(todayEntry); // Add to top
      await progress.save();
    }

    return res.status(200).json({
      today: todayEntry,
      previous: progress.dailyLog.filter((e) => e.date !== today),
    });
  } catch (err) {
    console.error("Daily challenge error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all resources (shared globally)
router.get("/resources", async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 }).populate("addedBy", "name");
    res.json(resources);
  } catch (err) {
    console.error("Fetch resources error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new resource (any logged-in user can add)
router.post("/resources", authMiddleware, async (req, res) => {
  const { title, link, description } = req.body;
  if (!title || !link || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newResource = await Resource.create({
      title,
      link,
      description,
      addedBy: req.user.id,
    });
    res.status(201).json(newResource);
  } catch (err) {
    console.error("Add resource error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all interview experiences
router.get("/interviews", authMiddleware,async (req, res) => {
  try {
    const all = await InterviewModel.find().sort({ createdAt: -1 }).populate("addedBy", "name");
    res.json(all);
  } catch (err) {
    console.error("Error fetching interviews:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new interview experience
router.post("/interviews",authMiddleware, async (req, res) => {
  try {
    const { company, candidate, description } = req.body;
    if (!company || !candidate || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newExperience = await InterviewModel.create({
      company,
      candidate,
      description,
      addedBy: req.user?.id || null, // Optional, if auth enabled
    });

    const populated = await newExperience.populate("addedBy", "name");
    res.status(201).json(populated);
  } catch (err) {
    console.error("Error saving experience:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/videos", authMiddleware, async (req, res) => {
  try {
    const { title, category, link } = req.body;
    if (!title || !category || !link) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newVideo = await Video.create({
      title,
      category,
      link,
      addedBy: req.user.id,
    });

    res.status(201).json(newVideo);
  } catch (err) {
    console.error("Error adding video:", err);
    res.status(500).json({ message: "Server error" });
  }
});





router.get("/videos", async (req, res) => {
  try {
    const sampleVideos = [
      {
        title: "DSA Crash Course",
        category: "DSA",
        link: "https://www.youtube.com/embed/8hly31xKli0",
      },
      {
        title: "React.js Tutorial",
        category: "Web Development",
        link: "https://www.youtube.com/embed/bMknfKXIFA8",
      },
      {
        title: "Data Science Roadmap",
        category: "Data Science",
        link: "https://www.youtube.com/embed/X3paOmcrTjQ",
      },
      
    ];

    

   

    res.json(sampleVideos);
  } catch (err) {
    console.error("Error fetching or seeding videos:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// This route will only respond true if the user is authenticated
router.get("/check-auth", authMiddleware, (req, res) => {
  res.json({ isLoggedIn: true, user: req.user }); // optional: include user info
});

// Add a fallback unauthenticated route if needed
router.get("/check-auth", (req, res) => {
  res.json({ isLoggedIn: false });
});

module.exports = router;


module.exports = router;
