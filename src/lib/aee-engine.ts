import type { Requirements } from "../components/InputForm";

export function buildEngineeringAnalysis(
  req: Requirements
): string {
  const { payload, speed, distance, objectShape } = req;
  
  const cycleTime = 60 / speed;
  const hz = speed / 60;
  
  const gripperWeight = payload < 1 ? 0.1 : 0.5;
  const safetyFactor = 1.5;
  const effectivePayload = payload + gripperWeight;
  const requiredRating = effectivePayload * safetyFactor;
  
  const approachDist = 100;
  const totalTravel = distance + approachDist * 2;
  
  let speedAssessment = "";
  if (speed > 120) {
    speedAssessment = "WARNING: EXCEEDS standard 6-axis capability - recommend SCARA or Delta robot";
  } else if (speed > 80) {
    speedAssessment = "WARNING: HIGH speed - requires SCARA or high-speed 6-axis";
  } else {
    speedAssessment = "OK: Achievable with standard robots";
  }
  
  let gripperRec = "";
  switch (objectShape) {
    case "box":
      gripperRec = "Parallel gripper (SCHUNK EPG, Robotiq 2F)";
      break;
    case "cylinder":
      gripperRec = "3-finger gripper or parallel with curved tips";
      break;
    case "flat":
      gripperRec = "Vacuum gripper (Piab XC, SMC ZP)";
      break;
    case "sphere":
      gripperRec = "3-finger centering gripper";
      break;
    default:
      gripperRec = "Adaptive gripper (Robotiq 2F-85)";
  }

  const analysis = "================================================\n" +
    "ENGINEERING ANALYSIS\n" +
    "================================================\n\n" +
    "1. CYCLIC FREQUENCY (" + speed + "/min)\n" +
    "   - Cycle time: " + cycleTime.toFixed(2) + "s per cycle (" + hz.toFixed(2) + " Hz)\n" +
    "   - " + speedAssessment + "\n" +
    "   - Standard 6-axis max: 60-80 ppm\n" +
    "   - SCARA/Delta max: 150-200 ppm\n\n" +
    "2. PAYLOAD CALCULATION\n" +
    "   - Object: " + payload + " kg\n" +
    "   - Gripper est.: " + gripperWeight + " kg\n" +
    "   - Safety factor: " + safetyFactor + "x (dynamic)\n" +
    "   - Required robot rating: >=" + requiredRating.toFixed(1) + " kg\n\n" +
    "3. REACH CALCULATION\n" +
    "   - Travel distance: " + distance + "mm\n" +
    "   - Approach/depart: +" + approachDist + "mm each side\n" +
    "   - Minimum reach: " + totalTravel + "mm\n\n" +
    "4. GRIPPER RECOMMENDATIONS\n" +
    "   - Object shape: " + objectShape + "\n" +
    "   - " + gripperRec + "\n" +
    "================================================";

  return analysis;
}

export async function callLLM(
  _prompt: string,
  _apiToken: string
): Promise<string> {
  console.log("LLM called - add your Cloudflare AI token");
  return "LLM response";
}

export function getGripperRecommendation(objectShape: string): string {
  const recommendations: Record<string, string> = {
    box: "parallel",
    cylinder: "parallel",
    flat: "vacuum",
    sphere: "parallel",
    irregular: "parallel",
  };
  return recommendations[objectShape] || "parallel";
}