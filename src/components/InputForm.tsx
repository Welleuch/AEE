import { useState } from "react";
import "./InputForm.css";

export interface Requirements {
  payload: number;
  speed: number;
  distance: number;
  objectShape: string;
}

interface InputFormProps {
  onSubmit: (req: Requirements) => void;
  isLoading?: boolean;
}

const objectShapes = [
  { value: "box", label: "Box / Cuboid" },
  { value: "cylinder", label: "Cylinder" },
  { value: "sphere", label: "Sphere" },
  { value: "flat", label: "Flat / Sheet" },
  { value: "irregular", label: "Irregular" },
];

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [payload, setPayload] = useState(2);
  const [speed, setSpeed] = useState(100);
  const [distance, setDistance] = useState(300);
  const [objectShape, setObjectShape] = useState("box");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ payload, speed, distance, objectShape });
  };

  return (
    <div className="input-form">
      <div className="form-header">
        <h2>1. Define Your Requirements</h2>
        <p>Enter the key parameters for your pick-and-place application</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="payload">Payload (kg)</label>
          <input
            id="payload"
            type="number"
            min="0.1"
            max="50"
            step="0.1"
            value={payload}
            onChange={(e) => setPayload(parseFloat(e.target.value))}
            required
          />
          <span className="hint">Weight of the object to move</span>
        </div>

        <div className="form-group">
          <label htmlFor="speed">Speed (picks/min)</label>
          <input
            id="speed"
            type="number"
            min="1"
            max="500"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            required
          />
          <span className="hint">Target cycle rate</span>
        </div>

        <div className="form-group">
          <label htmlFor="distance">Travel Distance (mm)</label>
          <input
            id="distance"
            type="number"
            min="10"
            max="2000"
            value={distance}
            onChange={(e) => setDistance(parseInt(e.target.value))}
            required
          />
          <span className="hint">Horizontal travel from A to B</span>
        </div>

        <div className="form-group">
          <label htmlFor="objectShape">Object Shape</label>
          <select
            id="objectShape"
            value={objectShape}
            onChange={(e) => setObjectShape(e.target.value)}
          >
            {objectShapes.map((shape) => (
              <option key={shape.value} value={shape.value}>
                {shape.label}
              </option>
            ))}
          </select>
          <span className="hint">Determines gripper type</span>
        </div>

        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? "Analyzing..." : "Analyze Requirements"}
        </button>
      </form>
    </div>
  );
}