import pool from "../config/db.js";
import {
  createMatrixValueQuery,
  getMatrixValueByTaskId,
  getSupplyRiskAndBusinessImpactByProjectIdQuery,
} from "../queries/matrixQueries.js";
import { updateTaskStatusQuery } from "../queries/taskQueries.js"; // Import query untuk memperbarui status

import {
  validateInputRange,
  calculateScores,
  determineCategory,
  getValidMethods,
} from "../utils/kraljicValidation.js";

// Get all supply_risk and business_impact values by projectid
export const getSupplyRiskAndBusinessImpactByProjectId = async (req, res) => {
  const { projectid } = req.params;

  try {
    const result = await pool.query(getSupplyRiskAndBusinessImpactByProjectIdQuery, [projectid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching supply risk and business impact values:", error.message);
    res.status(500).json({ message: "Failed to fetch supply risk and business impact values" });
  }
};

// Get Matrix Value by taskid Number
export const getMatrixValue = async (req, res) => {
  const { taskid } = req.params;
  const taskIdInt = parseInt(taskid);

  if (isNaN(taskIdInt)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  try {
    const result = await pool.query(getMatrixValueByTaskId, [taskIdInt]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Kraljic value not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching Kraljic value:", error.message);
    res.status(500).json({ message: "Failed to fetch Kraljic value" });
  }
};

// Logic to create Matrix Value
export const createMatrixValue = async (req, res) => {
  const {
    taskId,
    magnitudeOfWork,
    impactOnSchedule,
    possibilityRePurchase,
    complexityOfWork,
    designFactors,
    supplierPerformanceRating,
    approvedManufacturerList,
    materialsOfConstruction,
    supplyRiskScore,
    businessImpactScore,
    category,
    methodOutput,
  } = req.body;

  try {
    // 1. Validasi range input
    const inputs = [
      magnitudeOfWork,
      impactOnSchedule,
      possibilityRePurchase,
      complexityOfWork,
      designFactors,
      supplierPerformanceRating,
      approvedManufacturerList,
      materialsOfConstruction,
    ];

    if (!validateInputRange(inputs)) {
      return res.status(400).json({
        error: "Input harus berupa angka dan berada di rentang 1-4",
      });
    }

    // 2. Validasi perhitungan score
    const calculatedScores = calculateScores({
      complexityOfWork,
      designFactors,
      supplierPerformanceRating,
      approvedManufacturerList,
      materialsOfConstruction,
      magnitudeOfWork,
      impactOnSchedule,
      possibilityRePurchase,
    });

    if (calculatedScores.supplyRiskScore !== supplyRiskScore) {
      return res.status(400).json({
        error: "Invalid supply risk score calculation",
      });
    }

    if (calculatedScores.businessImpactScore !== businessImpactScore) {
      return res.status(400).json({
        error: "Invalid business impact score calculation",
      });
    }

    // 3. Validasi kategori
    const calculatedCategory = determineCategory(
      supplyRiskScore,
      businessImpactScore
    );
    if (calculatedCategory !== category) {
      return res.status(400).json({
        error: "Invalid category determination",
      });
    }

    // 4. Validasi method output
    const validMethods = getValidMethods(category);
    if (!validMethods.includes(methodOutput)) {
      return res.status(400).json({
        error: "Invalid method output for this category",
      });
    }

    // 5. Insert ke database
    const result = await pool.query(createMatrixValueQuery, [
      taskId,
      magnitudeOfWork,
      impactOnSchedule,
      possibilityRePurchase,
      complexityOfWork,
      designFactors,
      supplierPerformanceRating,
      approvedManufacturerList,
      materialsOfConstruction,
      supplyRiskScore,
      businessImpactScore,
      category,
      methodOutput,
    ]);

    // 6. Update status di tasklist
    await pool.query(updateTaskStatusQuery, [taskId]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating kraljic value:", error.message);
    res.status(500).json({
      error: "Failed to create kraljic value",
      details: error.message,
    });
  }
};
