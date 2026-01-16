import { NextFunction, Request, Response } from "express";
import { SearchService } from "../services/Search.service";

export class SearchController {
  constructor(private searchService: SearchService) {}

  /* ===========================
     SEARCH (GET)
  =========================== */
  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = req.query.q as string;

      const result = await this.searchService.search(q);

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
