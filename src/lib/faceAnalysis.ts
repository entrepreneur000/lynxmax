// Face analysis utilities using face-api.js
// This file contains all the logic for computing facial metrics

export interface FacialMetrics {
  ipd: number;
  icdRatio: number;
  faceWidthRatio: number;
  faceHeightRatio: number;
  symmetryScore: number;
  canthalTilt: number;
  browEyeDistance: number;
  nasalWidth: number;
  nasalLength: number;
  mouthWidth: number;
  lipRatio: number;
  bizygomaticBigonialRatio: number;
  chinHeight: number;
  chinWidth: number;
  chinProjection: number;
  jawlineSharpness: number;
  gonialAngle: number;
  ramusHeight: number;
  facialThirds: { upper: number; mid: number; lower: number };
  facialIndex: number;
  facialConvexity: number;
}

export interface QualityMetrics {
  roll: number;
  yaw: number;
  ipd: number;
}

// Calculate distance between two points
const distance = (p1: any, p2: any): number => {
  const dx = p1._x - p2._x;
  const dy = p1._y - p2._y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Calculate angle between three points
const angle = (p1: any, p2: any, p3: any): number => {
  const a = distance(p2, p3);
  const b = distance(p1, p3);
  const c = distance(p1, p2);
  const angleRad = Math.acos((a * a + c * c - b * b) / (2 * a * c));
  return (angleRad * 180) / Math.PI;
};

export const analyzeFace = (landmarks: any): { metrics: FacialMetrics; quality: QualityMetrics } => {
  const positions = landmarks.positions;
  
  // Key landmarks (68-point model)
  const leftEye = { outer: positions[36], inner: positions[39] };
  const rightEye = { outer: positions[45], inner: positions[42] };
  const nose = { top: positions[27], bottom: positions[33], left: positions[31], right: positions[35] };
  const mouth = { left: positions[48], right: positions[54], upperCenter: positions[51], lowerCenter: positions[57] };
  const jaw = { left: positions[0], right: positions[16], chin: positions[8] };
  const face = { top: positions[19], left: positions[0], right: positions[16] };
  
  // Calculate IPD (Inter-Pupillary Distance) - normalization unit
  const leftPupil = {
    _x: (leftEye.outer._x + leftEye.inner._x) / 2,
    _y: (leftEye.outer._y + leftEye.inner._y) / 2
  };
  const rightPupil = {
    _x: (rightEye.outer._x + rightEye.inner._x) / 2,
    _y: (rightEye.outer._y + rightEye.inner._y) / 2
  };
  const ipd = distance(leftPupil, rightPupil);
  
  // Quality metrics
  const roll = Math.abs(Math.atan2(rightPupil._y - leftPupil._y, rightPupil._x - leftPupil._x) * 180 / Math.PI);
  const leftEyeWidth = distance(leftEye.outer, leftEye.inner);
  const rightEyeWidth = distance(rightEye.outer, rightEye.inner);
  const yaw = Math.min(leftEyeWidth, rightEyeWidth) / Math.max(leftEyeWidth, rightEyeWidth);
  
  // 1. ICD ratio (Intercanthal distance / IPD)
  const icd = distance(leftEye.inner, rightEye.inner);
  const icdRatio = icd / ipd;
  
  // 2. Face width ratio (bizygomatic approximation)
  const faceWidth = distance(jaw.left, jaw.right);
  const faceWidthRatio = faceWidth / ipd;
  
  // 3. Face height ratio
  const faceHeight = distance(face.top, jaw.chin);
  const faceHeightRatio = faceHeight / ipd;
  
  // 4. Symmetry score
  const midlineX = (leftPupil._x + rightPupil._x) / 2;
  let symmetryDeviations = 0;
  const symmetryPoints = [
    { left: positions[0], right: positions[16] },
    { left: positions[36], right: positions[45] },
    { left: positions[48], right: positions[54] },
  ];
  
  symmetryPoints.forEach(pair => {
    const leftDist = Math.abs(pair.left._x - midlineX);
    const rightDist = Math.abs(pair.right._x - midlineX);
    symmetryDeviations += Math.abs(leftDist - rightDist) / ipd;
  });
  const symmetryScore = Math.max(0, 100 - symmetryDeviations * 100);
  
  // 5. Canthal tilt
  const leftCanthalTilt = Math.atan2(leftEye.outer._y - leftEye.inner._y, leftEye.outer._x - leftEye.inner._x) * 180 / Math.PI;
  const rightCanthalTilt = Math.atan2(rightEye.inner._y - rightEye.outer._y, rightEye.inner._x - rightEye.outer._x) * 180 / Math.PI;
  const canthalTilt = (leftCanthalTilt + rightCanthalTilt) / 2;
  
  // 6. Brow-eye distance
  const leftBrow = positions[19];
  const rightBrow = positions[24];
  const browEyeDistance = ((distance(leftBrow, leftEye.inner) + distance(rightBrow, rightEye.inner)) / 2) / ipd;
  
  // 7. Nasal measurements
  const nasalWidth = distance(nose.left, nose.right) / ipd;
  const nasalLength = distance(nose.top, nose.bottom) / ipd;
  
  // 8. Mouth measurements
  const mouthWidth = distance(mouth.left, mouth.right) / ipd;
  const upperLipHeight = distance(mouth.upperCenter, nose.bottom);
  const lowerLipHeight = distance(mouth.lowerCenter, mouth.upperCenter);
  const lipRatio = upperLipHeight / lowerLipHeight;
  
  // 9. Jaw measurements
  const bizygomaticWidth = faceWidth;
  const bigonialWidth = distance(positions[4], positions[12]);
  const bizygomaticBigonialRatio = bizygomaticWidth / bigonialWidth;
  
  // 10. Chin measurements
  const chinHeight = distance(mouth.lowerCenter, jaw.chin) / ipd;
  const chinWidth = distance(positions[6], positions[10]) / ipd;
  const chinProjection = Math.abs(jaw.chin._x - midlineX) / ipd;
  
  // 11. Jawline sharpness (approximation based on angle)
  const jawlineSharpness = angle(positions[3], jaw.chin, positions[13]);
  
  // 12. Gonial angle (approximation)
  const gonialAngle = angle(positions[0], positions[4], jaw.chin);
  
  // 13. Ramus height (approximation)
  const ramusHeight = distance(positions[2], positions[0]) / ipd;
  
  // 14. Facial thirds
  const upperThird = distance(face.top, positions[27]);
  const midThird = distance(positions[27], nose.bottom);
  const lowerThird = distance(nose.bottom, jaw.chin);
  const totalHeight = upperThird + midThird + lowerThird;
  
  // 15. Facial index
  const facialIndex = faceHeight / faceWidth;
  
  // 16. Facial convexity (profile proxy)
  const nasionToMenton = distance(positions[27], jaw.chin);
  const facialConvexity = (nose.bottom._x - midlineX) / nasionToMenton;
  
  return {
    metrics: {
      ipd,
      icdRatio,
      faceWidthRatio,
      faceHeightRatio,
      symmetryScore,
      canthalTilt,
      browEyeDistance,
      nasalWidth,
      nasalLength,
      mouthWidth,
      lipRatio,
      bizygomaticBigonialRatio,
      chinHeight,
      chinWidth,
      chinProjection,
      jawlineSharpness,
      gonialAngle,
      ramusHeight,
      facialThirds: {
        upper: (upperThird / totalHeight) * 100,
        mid: (midThird / totalHeight) * 100,
        lower: (lowerThird / totalHeight) * 100,
      },
      facialIndex,
      facialConvexity,
    },
    quality: {
      roll,
      yaw,
      ipd,
    },
  };
};

export const formatMetrics = (metrics: FacialMetrics, gender: "male" | "female") => {
  const formatted = [
    {
      name: "IPD (Normalization Unit)",
      value: `${metrics.ipd.toFixed(1)}px`,
      feedback: "Used as scale reference for all measurements",
      confidence: "high" as const,
    },
    {
      name: "Intercanthal Ratio",
      value: metrics.icdRatio.toFixed(2),
      feedback: metrics.icdRatio >= 0.45 && metrics.icdRatio <= 0.55 ? "Ideal spacing" : "Slightly wider/narrower than ideal",
      confidence: "high" as const,
    },
    {
      name: "Face Width Ratio",
      value: metrics.faceWidthRatio.toFixed(2),
      feedback: metrics.faceWidthRatio >= 2.8 && metrics.faceWidthRatio <= 3.2 ? "Well-proportioned" : "Narrower/wider than average",
      confidence: "medium" as const,
    },
    {
      name: "Face Height Ratio",
      value: metrics.faceHeightRatio.toFixed(2),
      feedback: metrics.faceHeightRatio >= 3.5 && metrics.faceHeightRatio <= 4.0 ? "Balanced proportions" : "Longer/shorter than typical",
      confidence: "medium" as const,
    },
    {
      name: "Facial Symmetry",
      value: `${metrics.symmetryScore.toFixed(1)}%`,
      feedback: metrics.symmetryScore >= 90 ? "Excellent symmetry" : metrics.symmetryScore >= 80 ? "Good symmetry" : "Some asymmetry detected",
      confidence: "high" as const,
    },
    {
      name: "Canthal Tilt",
      value: `${metrics.canthalTilt.toFixed(1)}°`,
      feedback: metrics.canthalTilt > 2 ? "Positive tilt (hunter eyes)" : metrics.canthalTilt < -2 ? "Negative tilt" : "Neutral tilt",
      confidence: "high" as const,
    },
    {
      name: "Brow-Eye Distance",
      value: metrics.browEyeDistance.toFixed(2),
      feedback: metrics.browEyeDistance >= 0.5 && metrics.browEyeDistance <= 0.7 ? "Ideal spacing" : "Closer/farther than typical",
      confidence: "medium" as const,
    },
    {
      name: "Nasal Width",
      value: metrics.nasalWidth.toFixed(2),
      feedback: metrics.nasalWidth <= 0.45 ? "Narrow nose" : metrics.nasalWidth <= 0.55 ? "Average width" : "Wide nose",
      confidence: "medium" as const,
    },
    {
      name: "Nasal Length",
      value: metrics.nasalLength.toFixed(2),
      feedback: "Proportional to facial height",
      confidence: "medium" as const,
    },
    {
      name: "Mouth Width",
      value: metrics.mouthWidth.toFixed(2),
      feedback: metrics.mouthWidth >= 0.9 && metrics.mouthWidth <= 1.1 ? "Balanced width" : "Narrower/wider than typical",
      confidence: "high" as const,
    },
    {
      name: "Lip Ratio (Upper/Lower)",
      value: metrics.lipRatio.toFixed(2),
      feedback: metrics.lipRatio >= 0.45 && metrics.lipRatio <= 0.55 ? "Ideal lip proportion" : "Upper/lower lip imbalance",
      confidence: "medium" as const,
    },
    {
      name: "Jaw Width Ratio",
      value: metrics.bizygomaticBigonialRatio.toFixed(2),
      feedback: gender === "male" 
        ? metrics.bizygomaticBigonialRatio >= 1.2 ? "Strong, angular jaw" : "Softer jaw definition"
        : metrics.bizygomaticBigonialRatio >= 1.15 ? "Well-defined jaw" : "Softer jaw contour",
      confidence: "medium" as const,
    },
    {
      name: "Chin Height",
      value: metrics.chinHeight.toFixed(2),
      feedback: "Balanced lower third proportion",
      confidence: "medium" as const,
    },
    {
      name: "Chin Width",
      value: metrics.chinWidth.toFixed(2),
      feedback: "Proportional to jaw width",
      confidence: "low" as const,
    },
    {
      name: "Chin Projection",
      value: metrics.chinProjection.toFixed(2),
      feedback: metrics.chinProjection < 0.1 ? "Strong forward projection" : "Adequate projection",
      confidence: "low" as const,
    },
    {
      name: "Jawline Sharpness",
      value: `${metrics.jawlineSharpness.toFixed(1)}°`,
      feedback: metrics.jawlineSharpness < 130 ? "Sharp, defined jawline" : "Softer jawline angle",
      confidence: "low" as const,
    },
    {
      name: "Gonial Angle (Approx)",
      value: `${metrics.gonialAngle.toFixed(1)}°`,
      feedback: metrics.gonialAngle >= 110 && metrics.gonialAngle <= 130 ? "Ideal jaw angle" : "Wider/sharper than typical",
      confidence: "low" as const,
    },
    {
      name: "Ramus Height (Approx)",
      value: metrics.ramusHeight.toFixed(2),
      feedback: gender === "male"
        ? metrics.ramusHeight >= 1.0 ? "Long ramus (masculine)" : "Average ramus length"
        : "Proportional ramus length",
      confidence: "low" as const,
    },
    {
      name: "Facial Thirds",
      value: `${metrics.facialThirds.upper.toFixed(0)}% / ${metrics.facialThirds.mid.toFixed(0)}% / ${metrics.facialThirds.lower.toFixed(0)}%`,
      feedback: 
        Math.abs(metrics.facialThirds.upper - 33.3) < 3 &&
        Math.abs(metrics.facialThirds.mid - 33.3) < 3 &&
        Math.abs(metrics.facialThirds.lower - 33.3) < 3
          ? "Perfectly balanced thirds"
          : "Some variation from ideal thirds",
      confidence: "high" as const,
    },
    {
      name: "Facial Index",
      value: metrics.facialIndex.toFixed(2),
      feedback: 
        metrics.facialIndex < 1.2 ? "Wide face (brachycephalic)"
        : metrics.facialIndex > 1.4 ? "Long face (dolichocephalic)"
        : "Average facial proportion (mesocephalic)",
      confidence: "high" as const,
    },
  ];

  return formatted;
};

export const calculateOverallScore = (metrics: FacialMetrics, gender: "male" | "female"): number => {
  let score = 50; // Base score
  
  // Symmetry (20 points max)
  score += (metrics.symmetryScore / 100) * 20;
  
  // Proportions (15 points max)
  if (metrics.icdRatio >= 0.45 && metrics.icdRatio <= 0.55) score += 5;
  if (metrics.faceWidthRatio >= 2.8 && metrics.faceWidthRatio <= 3.2) score += 5;
  if (Math.abs(metrics.facialThirds.upper - 33.3) < 3) score += 5;
  
  // Canthal tilt (10 points max)
  if (metrics.canthalTilt > 2 && metrics.canthalTilt < 10) score += 10;
  else if (metrics.canthalTilt >= 0) score += 5;
  
  // Jawline (10 points max)
  if (gender === "male" && metrics.jawlineSharpness < 125) score += 10;
  else if (gender === "female" && metrics.jawlineSharpness < 135) score += 10;
  else score += 5;
  
  // Facial harmony (5 points)
  if (metrics.facialIndex >= 1.2 && metrics.facialIndex <= 1.4) score += 5;
  
  return Math.min(100, Math.max(0, Math.round(score)));
};

export const generateHarmonySummary = (score: number, metrics: FacialMetrics, gender: "male" | "female"): string => {
  const symmetryDesc = metrics.symmetryScore >= 90 ? "excellent facial symmetry" : metrics.symmetryScore >= 80 ? "good facial symmetry" : "moderate facial symmetry";
  const proportionDesc = metrics.facialIndex >= 1.2 && metrics.facialIndex <= 1.4 ? "well-balanced facial proportions" : "unique facial proportions";
  const canthalDesc = metrics.canthalTilt > 2 ? "positive canthal tilt" : metrics.canthalTilt < -2 ? "neutral eye positioning" : "balanced eye shape";
  
  if (score >= 80) {
    return `Outstanding facial harmony with ${symmetryDesc}, ${proportionDesc}, and ${canthalDesc}. Features are well-balanced and aesthetically pleasing.`;
  } else if (score >= 65) {
    return `Above-average attractiveness with ${symmetryDesc} and ${proportionDesc}. Several features align with aesthetic ideals.`;
  } else if (score >= 50) {
    return `Average facial characteristics with ${symmetryDesc}. Features show natural variation within normal ranges.`;
  } else {
    return `Unique facial features with ${proportionDesc}. Remember that attractiveness is subjective and these are just mathematical approximations.`;
  }
};
