// index.js
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
dotenv.config();

const authRoutes = require("./src/routes/authRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const userRoutes = require("./src/routes/userRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");

const categoryRoutes = require("./src/routes/categoryRoutes");
const partRoutes = require("./src/routes/partRoutes");
const wardRoutes = require("./src/routes/wardRoutes");
const areaRoutes = require("./src/routes/areaRoutes");
const voterRoutes = require("./src/routes/voterRoutes");
const searchRoutes = require("./src/routes/searchRoutes");

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// --- CORS Configuration ---
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  // "https://gitbook.htpl.cc",
  // "https://www.gitbook.htpl.cc",
  // "http://gitbook.htpl.cc",
  // "http://www.gitbook.htpl.cc",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/parts", partRoutes);
app.use("/api/wards", wardRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/voters", voterRoutes);
app.use("/api/search", searchRoutes);

app.get("/", (req, res) => {
  res.send("GitBook API is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
