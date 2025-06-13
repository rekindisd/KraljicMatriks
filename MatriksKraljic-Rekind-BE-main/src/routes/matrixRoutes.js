import { Router } from "express";
import {
  createMatrixValue,
  getMatrixValue,
  getSupplyRiskAndBusinessImpactByProjectId
} from "../controllers/matrixController.js";

const kraljicRouter = Router();

// Route untuk menambahkan data matrix value
kraljicRouter.post("/", createMatrixValue);

// Route untuk mendapatkan data matrix value berdasarkan requisitionNo
kraljicRouter.get("/:taskid", getMatrixValue);

// Route untuk mendapatkan semua supply_risk dan business_impact values
kraljicRouter.get("/SupplyAndBusiness/:projectid", getSupplyRiskAndBusinessImpactByProjectId);

export default kraljicRouter;
