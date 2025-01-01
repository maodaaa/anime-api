import type { NextFunction, Request, Response } from "express";
import { setResponseError } from "@helpers/error";
import { otakudesuInfo } from "@otakudesu/index";
import { samehadakuInfo } from "@samehadaku/index";
import generatePayload from "@helpers/payload";
import path from "path";
import fs from "fs";

const mainController = {
  getMainView(req: Request, res: Response, next: NextFunction): void {
    try {
      const getViewFile = (filePath: string) => {
        const fullPath = path.join(__dirname, "..", "public", "views", filePath);
        console.log("[DEBUG] Serving file:", fullPath);  // Log the path
        return fullPath;
      };

      res.sendFile(getViewFile("home.html"));
    } catch (error) {
      console.error("[ERROR] Error in getMainView:", error);
      next(error);
    }
  },

  getMainViewData(req: Request, res: Response, next: NextFunction): void {
    try {
      function getData() {
        const animeSources = {
          otakudesu: otakudesuInfo,
          samehadaku: samehadakuInfo,
        };

        const data = {
          message: "WAJIK ANIME API IS READY 🔥🔥🔥",
          sources: Object.values(animeSources),
        };

        const newData: { message: string; sources: any[] } = {
          message: data.message,
          sources: [],
        };

        data.sources.forEach((source) => {
          const sourcePath = path.join(__dirname, "..", "anims", source.baseUrlPath);
          console.log("[DEBUG] Checking if source path exists:", sourcePath); // Log path
          const exist = fs.existsSync(sourcePath);

          if (exist) {
            newData.sources.push({
              title: source.title,
              route: source.baseUrlPath,
            });
          }
        });

        return newData;
      }

      const data = getData();
      console.log("[DEBUG] Data to send:", data); // Log data
      res.json(generatePayload(res, { data }));
    } catch (error) {
      console.error("[ERROR] Error in getMainViewData:", error);
      next(error);
    }
  },

  _404(req: Request, res: Response, next: NextFunction): void {
    next(setResponseError(404, "halaman tidak ditemukan"));
  },
};

export default mainController;
