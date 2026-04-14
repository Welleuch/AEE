export interface Robot {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  payloadKg: number;
  reachMm: number;
  speedPpm: number;
  priceEur: number;
  flangeType: string;
  repeatabilityMm: number;
  axes: number;
  description: string;
}

export const robots: Robot[] = [
  {
    id: "doosan_m1013",
    name: "M1013",
    manufacturer: "Doosan Robotics",
    type: "SCARA",
    payloadKg: 10,
    reachMm: 1300,
    speedPpm: 200,
    priceEur: 8500,
    flangeType: "ISO 9409-1-50-4-M6",
    repeatabilityMm: 0.05,
    axes: 4,
    description: "High-speed SCARA for pick-and-place applications"
  },
  {
    id: "doosan_m0609",
    name: "M0609",
    manufacturer: "Doosan Robotics",
    type: "SCARA",
    payloadKg: 6,
    reachMm: 900,
    speedPpm: 180,
    priceEur: 6200,
    flangeType: "ISO 9409-1-31.5-4-M5",
    repeatabilityMm: 0.05,
    axes: 4,
    description: "Compact SCARA for small parts handling"
  },
  {
    id: "doosan_h2515",
    name: "H2515",
    manufacturer: "Doosan Robotics",
    type: "6-axis",
    payloadKg: 25,
    reachMm: 1500,
    speedPpm: 120,
    priceEur: 18500,
    flangeType: "ISO 9409-1-80-4-M8",
    repeatabilityMm: 0.1,
    axes: 6,
    description: "Heavy-duty 6-axis for machine tending"
  }
];

export const filterRobots = (
  minPayload: number,
  minSpeed: number,
  minReach: number
): Robot[] => {
  return robots.filter(
    robot =>
      robot.payloadKg >= minPayload &&
      robot.speedPpm >= minSpeed &&
      robot.reachMm >= minReach
  );
};