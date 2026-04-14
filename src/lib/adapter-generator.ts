import * as THREE from "three";
import type { Robot } from "../data/robots";
import type { Gripper } from "../data/grippers";

export interface AdapterParams {
  robotFlange: string;
  gripperFlange: string;
  adapterHeightMm?: number;
  holePattern?: string;
}

interface FlangeSpec {
  pitch: number;
  boltSize: string;
  maxBolt: number;
}

const FLANGE_SPECS: Record<string, FlangeSpec> = {
  "ISO 9409-1-50-4-M6": { pitch: 40, boltSize: "M6", maxBolt: 4 },
  "ISO 9409-1-31.5-4-M5": { pitch: 31.5, boltSize: "M5", maxBolt: 4 },
  "ISO 9409-1-80-4-M8": { pitch: 63, boltSize: "M8", maxBolt: 4 },
};

export function parseFlange(flangeType: string): FlangeSpec {
  return FLANGE_SPECS[flangeType] || { pitch: 40, boltSize: "M6", maxBolt: 4 };
}

export function generateAdapterPlate(params: AdapterParams): THREE.Group {
  const { robotFlange, gripperFlange, adapterHeightMm = 20 } = params;
  
  const robotSpec = parseFlange(robotFlange);
  const gripperSpec = parseFlange(gripperFlange);
  
  const robotRadius = robotSpec.pitch / 2 / 1000;
  const gripperRadius = gripperSpec.pitch / 2 / 1000;
  
  const topRadius = Math.min(robotRadius, gripperRadius);
  const bottomRadius = Math.max(robotRadius, gripperRadius);
  
  const height = adapterHeightMm / 1000;
  
  const group = new THREE.Group();
  
  const plateGeometry = new THREE.CylinderGeometry(
    bottomRadius,
    topRadius,
    height,
    32
  );
  const plateMaterial = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    metalness: 0.9,
    roughness: 0.1,
  });
  const plate = new THREE.Mesh(plateGeometry, plateMaterial);
  group.add(plate);
  
  const holeCount = robotSpec.maxBolt;
  const holeRadius = 0.003;
  const holeGeometry = new THREE.CircleGeometry(holeRadius, 16);
  const holeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  
  for (let i = 0; i < holeCount; i++) {
    const angle = (i / holeCount) * Math.PI * 2;
    const x = Math.cos(angle) * robotRadius * 0.8;
    const z = Math.sin(angle) * robotRadius * 0.8;
    
    const topHole = new THREE.Mesh(holeGeometry, holeMaterial);
    topHole.position.set(x, height / 2 + 0.001, z);
    topHole.rotation.x = -Math.PI / 2;
    group.add(topHole);
  }
  
  for (let i = 0; i < holeCount; i++) {
    const angle = (i / holeCount) * Math.PI * 2 + Math.PI / holeCount;
    const x = Math.cos(angle) * bottomRadius * 0.8;
    const z = Math.sin(angle) * bottomRadius * 0.8;
    
    const bottomHole = new THREE.Mesh(holeGeometry, holeMaterial);
    bottomHole.position.set(x, -height / 2 - 0.001, z);
    bottomHole.rotation.x = -Math.PI / 2;
    group.add(bottomHole);
  }
  
  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = 256;
  labelCanvas.height = 64;
  const ctx = labelCanvas.getContext("2d")!;
  ctx.fillStyle = "#64748b";
  ctx.fillRect(0, 0, 256, 64);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("AEE ADAPTER", 128, 40);
  
  const texture = new THREE.CanvasTexture(labelCanvas);
  const labelGeometry = new THREE.PlaneGeometry(bottomRadius * 1.5, bottomRadius * 0.4);
  const labelMaterial = new THREE.MeshBasicMaterial({ map: texture });
  const label = new THREE.Mesh(labelGeometry, labelMaterial);
  label.position.set(0, 0, bottomRadius + 0.001);
  group.add(label);
  
  return group;
}

export function canConnect(robot: Robot, gripper: Gripper): boolean {
  return gripper.compatibleFlanges.includes(robot.flangeType);
}

export function getAdapterDescription(robot: Robot, gripper: Gripper): string {
  const robotSpec = parseFlange(robot.flangeType);
  const gripperFlange = gripper.compatibleFlanges[0] || "ISO 9409-1-50-4-M6";
  const gripperSpec = parseFlange(gripperFlange);
  
  const desc = `
Adapter Plate Specification:
• Material: Aluminum 6082-T6
• Height: 20mm standard
• Top flange: ${gripperFlange} (${gripperSpec.boltSize} bolts)
• Bottom flange: ${robot.flangeType} (${robotSpec.boltSize} bolts)
  `.trim();
  
  return desc;
}