import { clientCache } from "@middlewares/cache";
import { otakudesuInfo, otakudesuRoute } from "@otakudesu/index";
import { samehadakuInfo, samehadakuRoute } from "@samehadaku/index";
import mainRoute from "@routes/mainRoute";
import errorHandler from "@middlewares/errorHandler";
import animeConfig from "@configs/animeConfig";
import path from "path";
import express from "express";
import cors from "cors";

const { PORT } = animeConfig;
const app = express();

// Debugging middleware
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url}`);
  console.log(`[DEBUG] Origin: ${req.headers.origin || 'No Origin'}`);
  console.log(`[DEBUG] User-Agent: ${req.headers['user-agent']}`);
  next();
});

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., server-side clients like Postman)
    if (!origin) return callback(null, true);
    // Allow all origins (for development). Use a whitelist for production.
    callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
  allowedHeaders: '*', // Allow all headers
  credentials: true, // If you need to support cookies or authentication
}));

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Custom client-side caching middleware
app.use(clientCache(1)); // Assuming this is your custom middleware

// Routes
app.use('/otakudesu', otakudesuRoute); // Example route
app.use('/samehadaku', samehadakuRoute); // Another route
app.use(mainRoute); // Catch-all main route

// Handle preflight requests (CORS OPTIONS)
app.options('*', cors()); // Allow preflight for all routes

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`SERVER BERJALAN DI http://localhost:${PORT}`);
});
