export const validateInputRange = (inputs) => {
    return inputs.every(value => 
      typeof value === 'number' && 
      value >= 1 && 
      value <= 4
    );
  };
  
  export const calculateScores = (inputs) => {
    const {
      complexityOfWork,
      designFactors,
      supplierPerformanceRating,
      approvedManufacturerList,
      materialsOfConstruction,
      magnitudeOfWork,
      impactOnSchedule,
      possibilityRePurchase
    } = inputs;
  
    const supplyRiskScore = Math.max(
      complexityOfWork,
      designFactors,
      supplierPerformanceRating,
      approvedManufacturerList,
      materialsOfConstruction
    );
  
    const businessImpactScore = Math.ceil(
      (magnitudeOfWork + impactOnSchedule + possibilityRePurchase) / 3
    );
  
    return { supplyRiskScore, businessImpactScore };
  };
  
  export const determineCategory = (supplyRisk, businessImpact) => {
    if (supplyRisk <= 2 && businessImpact >= 3) return 'Leverage Product';
    if (supplyRisk >= 3 && businessImpact >= 3) return 'Strategic Product';
    if (supplyRisk <= 2 && businessImpact <= 2) return 'Routine/Non-Critical Product';
    return 'Bottleneck Product';
  };
  
  export const getValidMethods = (category) => {
    const methodMap = {
      'Leverage Product': [
        'Competitive Bidding',
        'Combined Purchase',
        'E-Procurement dengan Otomatisasi Pemesanan'
      ],
      'Strategic Product': [
        'Partnership',
        'Binding dari Tahap Proposal',
        'Penunjukan Langsung',
        'Competitive Bidding'
      ],
      'Routine/Non-Critical Product': [
        'Combined Purchase',
        'E-Procurement dengan Otomatisasi Pemesanan',
        'Market Place'
      ],
      'Bottleneck Product': [
        'Competitive Bidding dengan Safety Stock'
      ]
    };
    return methodMap[category] || [];
  };