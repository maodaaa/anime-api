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

// Middleware to log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url}`);
  console.log(`[DEBUG] Origin: ${req.headers.origin}`);
  next();
});

// CORS Configuration: Allow all origins (for debugging/development)
app.use(cors({
  origin: '*', // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow common HTTP methods
  allowedHeaders: '*', // Allow all headers
}));

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Custom client-side cache middleware
app.use(clientCache(1));

// Routes
app.use(otakudesuInfo.baseUrlPath, otakudesuRoute);
app.use(samehadakuInfo.baseUrlPath, samehadakuRoute);
app.use(mainRoute);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`SERVER BERJALAN DI http://localhost:${PORT}`);
});
