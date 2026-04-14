import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stage, Grid } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import "./Viewer3D.css";

interface Viewer3DProps {
  robotName?: string;
  gripperName?: string;
  onGenerated?: () => void;
}

function RobotModel({ name }: { name: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const colors: Record<string, string> = {
    "M1013": "#e11d48",
    "M0609": "#2563eb",
    "H2515": "#7c3aed",
  };

  const color = colors[name] || "#4f46e5";

  return (
    <group
      ref={groupRef}
    >
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.8, 32]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.4, 32]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.2, 16]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function GripperModel({ name }: { name: string }) {
  const colors: Record<string, string> = {
    "EPG-320": "#f59e0b",
    "PGN-plus-100": "#10b981",
    "2F-85": "#8b5cf6",
    "XC300": "#06b6d4",
    "ZP250U": "#ec4899",
  };

  const color = colors[name] || "#4f46e5";

  return (
    <group position={[0, 1.1, 0]}>
      <mesh>
        <boxGeometry args={[0.08, 0.1, 0.08]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-0.03, 0.08, 0]}>
        <boxGeometry args={[0.02, 0.08, 0.04]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.03, 0.08, 0]}>
        <boxGeometry args={[0.02, 0.08, 0.04]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

function AdapterModel() {
  return (
    <mesh position={[0, 0.95, 0]}>
      <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
      <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
    </mesh>
  );
}

function Scene({
  robotName,
  gripperName,
}: {
  robotName?: string;
  gripperName?: string;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} />

      {robotName && <RobotModel name={robotName} />}
      {gripperName && <GripperModel name={gripperName} />}
      <AdapterModel />

      <Grid
        position={[0, -0.01, 0]}
        args={[10, 10]}
        cellSize={0.1}
        cellThickness={0.5}
        cellColor="#333"
        sectionSize={0.5}
        sectionThickness={1}
        sectionColor="#444"
        fadeDistance={20}
        infiniteGrid
      />

      <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

export function Viewer3D({ robotName, gripperName, onGenerated }: Viewer3DProps) {
  const hasData = robotName || gripperName;

  return (
    <div className="viewer-3d">
      <div className="viewer-header">
        <h3>4. Generated Assembly</h3>
        {hasData && (
          <button
            className="refresh-btn"
            onClick={onGenerated}
            title="Regenerate design"
          >
            ↻
          </button>
        )}
      </div>

      <div className="viewer-canvas">
        <Canvas
          camera={{ position: [2, 1.5, 2], fov: 45 }}
          shadows
          gl={{ antialias: true }}
        >
          {!hasData ? (
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#333" wireframe />
            </mesh>
          ) : (
            <Stage environment="city" intensity={0.5} shadows="contact">
              <Scene robotName={robotName} gripperName={gripperName} />
            </Stage>
          )}
        </Canvas>
      </div>

      {!hasData && (
        <div className="viewer-placeholder">
          <p>Select a robot and gripper to view the assembly</p>
        </div>
      )}

      {hasData && (
        <div className="assembly-info">
          <span className="label">Robot:</span>
          <span className="value">{robotName || "—"}</span>
          <span className="label">Gripper:</span>
          <span className="value">{gripperName || "—"}</span>
        </div>
      )}
    </div>
  );
}