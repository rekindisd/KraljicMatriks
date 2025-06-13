export const createMatrixValueQuery = `
  INSERT INTO kraljicValue (
    taskid,
    magnitude_work,
    impact_schedule,
    possibility_repurchase,
    complexity_work,
    design_factors,
    supplier_rating,
    approved_manufacturer,
    materials_construction,
    supply_risk,
    business_impact,
    category,
    method_output
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
  RETURNING *;
`;

export const getMatrixValueByTaskId = `
  SELECT * FROM kraljicvalue WHERE taskid = $1;
`;

export const getAllSupplyRiskAndBusinessImpactQuery = `
  SELECT supply_risk, business_impact FROM kraljicValue;
`;

export const getSupplyRiskAndBusinessImpactByTaskIdQuery = `
  SELECT supply_risk, business_impact FROM kraljicValue WHERE taskid = $1;
`;

export const getSupplyRiskAndBusinessImpactByProjectIdQuery = `
  SELECT kv.supply_risk, kv.business_impact
  FROM kraljicValue kv
  JOIN tasklist tl ON kv.taskid = tl.taskid
  WHERE tl.projectid = $1;
`;

