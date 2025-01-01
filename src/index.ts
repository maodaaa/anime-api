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


const corsOptions = {
  origin: '*',  // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allow relevant HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With'],  // Add any headers you need
};

app.use(cors(corsOptions));

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
