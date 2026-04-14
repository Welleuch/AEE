import type { Robot } from "../data/robots";
import type { Gripper } from "../data/grippers";
import "./SelectionCards.css";

interface SelectionCardsProps<T extends { id: string; name: string }> {
  title: string;
  items: T[];
  selectedId: string | null;
  onSelect: (item: T) => void;
  renderDetails: (item: T) => React.ReactNode;
}

export function RobotSelection({
  robots,
  selectedRobotId,
  onSelect,
}: {
  robots: Robot[];
  selectedRobotId: string | null;
  onSelect: (robot: Robot) => void;
}) {
  return (
    <SelectionCards
      title="2. Select Robot"
      items={robots}
      selectedId={selectedRobotId}
      onSelect={onSelect}
      renderDetails={(robot) => (
        <>
          <div className="detail-header">
            <span className="manufacturer">{robot.manufacturer}</span>
            <span className="type">{robot.type}</span>
          </div>
          <div className="detail-specs">
            <div className="spec">
              <span className="label">Payload</span>
              <span className="value">{robot.payloadKg} kg</span>
            </div>
            <div className="spec">
              <span className="label">Reach</span>
              <span className="value">{robot.reachMm} mm</span>
            </div>
            <div className="spec">
              <span className="label">Speed</span>
              <span className="value">{robot.speedPpm} ppm</span>
            </div>
            <div className="spec">
              <span className="label">Price</span>
              <span className="value">€{robot.priceEur.toLocaleString()}</span>
            </div>
          </div>
          <p className="description">{robot.description}</p>
        </>
      )}
    />
  );
}

export function GripperSelection({
  grippers,
  selectedGripperId,
  onSelect,
}: {
  grippers: Gripper[];
  selectedGripperId: string | null;
  onSelect: (gripper: Gripper) => void;
}) {
  return (
    <SelectionCards
      title="3. Select Gripper"
      items={grippers}
      selectedId={selectedGripperId}
      onSelect={onSelect}
      renderDetails={(gripper) => (
        <>
          <div className="detail-header">
            <span className="manufacturer">{gripper.manufacturer}</span>
            <span className={`type-badge ${gripper.type}`}>{gripper.type}</span>
          </div>
          <div className="detail-specs">
            <div className="spec">
              <span className="label">Force</span>
              <span className="value">{gripper.forceN} N</span>
            </div>
            {gripper.strokeMm > 0 && (
              <div className="spec">
                <span className="label">Stroke</span>
                <span className="value">{gripper.strokeMm} mm</span>
              </div>
            )}
            <div className="spec">
              <span className="label">Price</span>
              <span className="value">€{gripper.priceEur.toLocaleString()}</span>
            </div>
          </div>
          <p className="description">{gripper.description}</p>
        </>
      )}
    />
  );
}

function SelectionCards<T extends { id: string; name: string }>({
  title,
  items,
  selectedId,
  onSelect,
  renderDetails,
}: SelectionCardsProps<T>) {
  if (items.length === 0) {
    return (
      <div className="selection-cards empty">
        <h3>{title}</h3>
        <p className="no-results">No compatible options found. Try different requirements.</p>
      </div>
    );
  }

  return (
    <div className="selection-cards">
      <h3>{title}</h3>
      <div className="cards-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className={`card ${selectedId === item.id ? "selected" : ""}`}
            onClick={() => onSelect(item)}
          >
            <div className="card-header">
              <span className="name">{item.name}</span>
              {selectedId === item.id && <span className="check">✓</span>}
            </div>
            <div className="card-details">{renderDetails(item)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}