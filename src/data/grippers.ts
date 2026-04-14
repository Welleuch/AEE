export interface Gripper {
  id: string;
  name: string;
  manufacturer: string;
  type: "parallel" | "vacuum" | "magnetic";
  strokeMm: number;
  forceN: number;
  priceEur: number;
  compatibleFlanges: string[];
  description: string;
}

export const grippers: Gripper[] = [
  {
    id: "schunk_epg320",
    name: "EPG-320",
    manufacturer: "SCHUNK",
    type: "parallel",
    strokeMm: 20,
    forceN: 120,
    priceEur: 2400,
    compatibleFlanges: ["ISO 9409-1-50-4-M6", "ISO 9409-1-31.5-4-M5"],
    description: "Electric 2-finger parallel gripper, high force"
  },
  {
    id: "schunk_pgn_100",
    name: "PGN-plus-100",
    manufacturer: "SCHUNK",
    type: "parallel",
    strokeMm: 14,
    forceN: 180,
    priceEur: 1800,
    compatibleFlanges: ["ISO 9409-1-50-4-M6", "ISO 9409-1-31.5-4-M5", "ISO 9409-1-80-4-M8"],
    description: "Pneumatic 2-finger parallel gripper, maximum force"
  },
  {
    id: "robotiq_2f85",
    name: "2F-85",
    manufacturer: "Robotiq",
    type: "parallel",
    strokeMm: 85,
    forceN: 130,
    priceEur: 2800,
    compatibleFlanges: ["ISO 9409-1-50-4-M6", "ISO 9409-1-31.5-4-M5"],
    description: "Adaptive 2-finger gripper for versatile picking"
  },
  {
    id: "piab_xc300",
    name: "XC300",
    manufacturer: "Piab",
    type: "vacuum",
    strokeMm: 0,
    forceN: 300,
    priceEur: 3200,
    compatibleFlanges: ["ISO 9409-1-50-4-M6", "ISO 9409-1-31.5-4-M5"],
    description: "Vacuum gripper for flat and non-porous surfaces"
  },
  {
    id: "smc_zp250",
    name: "ZP250U",
    manufacturer: "SMC",
    type: "vacuum",
    strokeMm: 0,
    forceN: 250,
    priceEur: 1800,
    compatibleFlanges: ["ISO 9409-1-50-4-M6", "ISO 9409-1-31.5-4-M5", "ISO 9409-1-80-4-M8"],
    description: "Compact vacuum generator for packaging"
  }
];

export const filterGrippers = (flangeType: string): Gripper[] => {
  return grippers.filter(gripper =>
    gripper.compatibleFlanges.includes(flangeType)
  );
};