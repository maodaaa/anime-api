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

// Middlewares
// Allow all origins
app.use(cors({ origin: '*' }));
app.use(clientCache(1)); // Custom caching middleware

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use(otakudesuInfo.baseUrlPath, otakudesuRoute);
app.use(samehadakuInfo.baseUrlPath, samehadakuRoute);
app.use(mainRoute);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`SERVER BERJALAN DI http://localhost:${PORT}`);
});
