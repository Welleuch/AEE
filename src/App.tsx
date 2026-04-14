import { useState, useCallback } from "react";
import { InputForm, type Requirements } from "./components/InputForm";
import { RobotSelection, GripperSelection } from "./components/SelectionCards";
import { Viewer3D } from "./components/Viewer3D";
import { OutputPanel } from "./components/OutputPanel";
import { robots, type Robot } from "./data/robots";
import { grippers, type Gripper, filterGrippers } from "./data/grippers";
import { buildEngineeringAnalysis } from "./lib/aee-engine";
import "./App.css";

type Step = "requirements" | "robot" | "gripper" | "assembly" | "output";

function App() {
  const [currentStep, setCurrentStep] = useState<Step>("requirements");
  const [_requirements, setRequirements] = useState<Requirements | null>(null);
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);
  const [selectedGripper, setSelectedGripper] = useState<Gripper | null>(null);
  const [engineeringAnalysis, setEngineeringAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [filteredRobots, setFilteredRobots] = useState<Robot[]>([]);
  const [filteredGrippers, setFilteredGrippers] = useState<Gripper[]>([]);

  const handleRequirementsSubmit = useCallback((req: Requirements) => {
    setRequirements(req);
    setIsAnalyzing(true);

    setTimeout(() => {
      const analysis = buildEngineeringAnalysis(req);
      setEngineeringAnalysis(analysis);

      const minPayload = req.payload * 1.5;
      const minSpeed = req.speed;
      const minReach = req.distance + 200;

      const filtered = robots.filter(
        (r) => r.payloadKg >= minPayload && r.speedPpm >= minSpeed && r.reachMm >= minReach
      );
      setFilteredRobots(filtered.length > 0 ? filtered : robots.slice(0, 3));

      setIsAnalyzing(false);
      setCurrentStep("robot");
    }, 500);
  }, []);

  const handleRobotSelect = useCallback((robot: Robot) => {
    setSelectedRobot(robot);
    const compatible = filterGrippers(robot.flangeType);
    setFilteredGrippers(compatible.length > 0 ? compatible : grippers.slice(0, 3));
    setCurrentStep("gripper");
  }, []);

  const handleGripperSelect = useCallback((gripper: Gripper) => {
    setSelectedGripper(gripper);
    setCurrentStep("assembly");
  }, []);

  const handleGenerate = useCallback(() => {
    setCurrentStep("output");
  }, []);

  const handleReset = useCallback(() => {
    setCurrentStep("requirements");
    setRequirements(null);
    setSelectedRobot(null);
    setSelectedGripper(null);
    setEngineeringAnalysis("");
    setFilteredRobots([]);
    setFilteredGrippers([]);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-aee">AEE</span>
          <span className="logo-text">Autonomous Engineering Engine</span>
        </div>
        {currentStep !== "requirements" && (
          <button className="reset-btn" onClick={handleReset}>
            New Project
          </button>
        )}
      </header>

      <main className="main">
        {(currentStep === "requirements" || currentStep === "robot" || currentStep === "gripper" || currentStep === "assembly" || currentStep === "output") && (
          <div className="step requirements-step">
            <InputForm onSubmit={handleRequirementsSubmit} isLoading={isAnalyzing} />
          </div>
        )}

        {(currentStep === "robot" || currentStep === "gripper" || currentStep === "assembly" || currentStep === "output") && filteredRobots.length > 0 && (
          <div className="step robot-step">
            <RobotSelection
              robots={filteredRobots}
              selectedRobotId={selectedRobot?.id || null}
              onSelect={handleRobotSelect}
            />
          </div>
        )}

        {(currentStep === "gripper" || currentStep === "assembly" || currentStep === "output") && filteredGrippers.length > 0 && (
          <div className="step gripper-step">
            <GripperSelection
              grippers={filteredGrippers}
              selectedGripperId={selectedGripper?.id || null}
              onSelect={handleGripperSelect}
            />
          </div>
        )}

        {(currentStep === "assembly" || currentStep === "output") && (
          <div className="step assembly-step">
            <Viewer3D
              robotName={selectedRobot?.name}
              gripperName={selectedGripper?.name}
              onGenerated={handleGenerate}
            />
          </div>
        )}

        {currentStep === "output" && (
          <div className="step output-step">
            <OutputPanel
              robot={selectedRobot}
              gripper={selectedGripper}
              engineeringAnalysis={engineeringAnalysis}
            />
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="progress">
          <span className={`progress-step ${currentStep !== "requirements" ? "active" : ""}`}>
            1. Requirements
          </span>
          <span className="progress-line" />
          <span className={`progress-step ${["robot", "gripper", "assembly", "output"].includes(currentStep) ? "active" : ""}`}>
            2. Robot
          </span>
          <span className="progress-line" />
          <span className={`progress-step ${["gripper", "assembly", "output"].includes(currentStep) ? "active" : ""}`}>
            3. Gripper
          </span>
          <span className="progress-line" />
          <span className={`progress-step ${["assembly", "output"].includes(currentStep) ? "active" : ""}`}>
            4. Assembly
          </span>
          <span className="progress-line" />
          <span className={`progress-step ${currentStep === "output" ? "active" : ""}`}>
            5. Output
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;