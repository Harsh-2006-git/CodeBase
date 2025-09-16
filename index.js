import * as dotenv from "dotenv";
import express from "express";
import { connectDB, sequelize } from "./config/database.js";
import errorHandler from "./middlewares/errorHandler.js";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import zoneRoutes from "./routes/ZoneRoutes.js";
import lostFoundRoutes from "./routes/lostFoundRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS configuration
const allowedOrigins = [
  "https://ujjainyatra-harsh09.vercel.app", // Vercel frontend
  "http://127.0.0.1:3000", // Local frontend (React default)
  "http://localhost:5173", // Vite frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// ✅ Handle OPTIONS requests globally (important for preflight)
app.options("*", cors());

// ✅ Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allow serving images/files
  })
);

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 Ujjain Yatra Backend Running");
});

// ✅ API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/zone", zoneRoutes);
app.use("/api/v1/lost", lostFoundRoutes);
app.use("/api/v1/ticket", ticketRoutes);

// ✅ Error handling middleware (keep last)
app.use(errorHandler);

// ✅ Start server
const startServer = async () => {
  try {
    console.log("🔄 Starting server...");
    await connectDB();
    await sequelize.sync({ alter: true });

    app.listen(PORT, "0.0.0.0", () => {
      console.log("✅ Database synchronized");
      console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
      console.log(`🌐 Allowed origins: ${allowedOrigins.join(", ")}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
