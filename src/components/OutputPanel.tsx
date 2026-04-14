import type { Robot } from "../data/robots";
import type { Gripper } from "../data/grippers";
import "./OutputPanel.css";

interface OutputPanelProps {
  robot: Robot | null;
  gripper: Gripper | null;
  engineeringAnalysis: string;
}

export function OutputPanel({ robot, gripper, engineeringAnalysis }: OutputPanelProps) {
  const totalCost = (robot?.priceEur || 0) + (gripper?.priceEur || 0);
  const adapterCost = 150;

  return (
    <div className="output-panel">
      <div className="panel-section analysis">
        <h3>Engineering Analysis</h3>
        <pre className="analysis-text">{engineeringAnalysis}</pre>
      </div>

      <div className="panel-section bom">
        <h3>5. Bill of Materials (BOM)</h3>
        <table className="bom-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                {robot?.manufacturer} {robot?.name} ({robot?.type})
              </td>
              <td>1</td>
              <td>€{robot?.priceEur.toLocaleString() || "—"}</td>
              <td>€{robot?.priceEur.toLocaleString() || "—"}</td>
            </tr>
            <tr>
              <td>2</td>
              <td>
                {gripper?.manufacturer} {gripper?.name}
              </td>
              <td>1</td>
              <td>€{gripper?.priceEur.toLocaleString() || "—"}</td>
              <td>€{gripper?.priceEur.toLocaleString() || "—"}</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Custom Adapter Plate (Generated)</td>
              <td>1</td>
              <td>€{adapterCost}</td>
              <td>€{adapterCost}</td>
            </tr>
            <tr className="total-row">
              <td colSpan={4}>Total Estimated Cost</td>
              <td>€{totalCost + adapterCost}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="panel-section code">
        <h3>6. Generated PLC Code (Structured Text)</h3>
        <div className="code-preview">
          <pre>
{`// AEE Generated PLC Code
// Robot: ${robot?.name || "—"}
// Gripper: ${gripper?.name || "—"}

// Configuration
CONSTANT PICK_SPEED : INT := ${robot?.speedPpm || 60};
CONSTANT PICK_PAYLOAD : REAL := ${robot?.payloadKg || 0};
CONSTANT TOOL_NUMBER : INT := 1;

// Main Program
PROGRAM MainPickAndPlace
VAR
  positionA : ARRAY[1..3] OF REAL;
  positionB : ARRAY[1..3] OF REAL;
  gripperStatus : BOOL;
END_VAR

// Initialize positions  
positionA := [0, 100, 0];  // Pick position
positionB := [300, 100, 0]; // Place position

// Gripper control
SET_tool(TOOL_NUMBER, TRUE);  // Close gripper
wait_time(0.2);

// Move to pick position
MoveJ(positionA, PICK_SPEED);

// Close gripper on object
Close_gripper(TOOL_NUMBER);

// Move to place position  
MoveL(positionB, PICK_SPEED);

// Release object
Open_gripper(TOOL_NUMBER);

END_PROGRAM`}
          </pre>
        </div>
      </div>
    </div>
  );
}