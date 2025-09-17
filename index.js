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

// ✅ Enhanced CORS configuration
const allowedOrigins = [
  "https://ujjainyatra-harsh09.vercel.app",// Vercel frontend
  "http://127.0.0.1:3000", // Local frontend (React default)
  "http://localhost:3000", // Local frontend (React default)
  "http://localhost:5173", // Vite frontend
  "http://localhost:5174", // Vite alternative port
];

// More comprehensive CORS setup
const corsOptions = {
  origin: function (origin, callback) {
    console.log(`🌐 CORS Request from origin: ${origin || 'no origin'}`);
    
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) {
      console.log('✅ Allowing request with no origin');
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin allowed:', origin);
      return callback(null, true);
    }
    
    // For development, allow localhost with any port
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      console.log('✅ Allowing localhost origin:', origin);
      return callback(null, true);
    }
    
    console.log('❌ Origin not allowed:', origin);
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// ✅ Handle OPTIONS requests globally for all routes
app.options('/*path', (req, res) => {
  console.log(`🔧 OPTIONS request for: ${req.originalUrl}`);
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(200);
});

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

// ✅ Additional CORS headers middleware (add before routes)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Set CORS headers
  if (origin && (allowedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1'))) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  
  // Log request details for debugging
  console.log(`${req.method} ${req.originalUrl} from ${origin || 'no origin'}`);
  
  next();
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 Ujjain Yatra Backend Running");
});

// ✅ API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/zone", zoneRoutes);
app.use("/api/v1/lost", lostFoundRoutes);
app.use("/api/v1/ticket", ticketRoutes);

// ✅ Catch-all route for unmatched paths (FIXED: Named the wildcard parameter)
app.get("/*catchall", (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: "Route not found",
    path: req.params.catchall 
  });
});

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
      console.log(`🌐 Server running at https://ujjain-yatra-harsh-09.onrender.com`);
      console.log(`🌐 Allowed origins: ${allowedOrigins.join(", ")}`);
      console.log(`📡 CORS enabled for preflight requests`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
