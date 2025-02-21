import React from "react";
import "./MapComponent.css"; // Import the stylesheet
import TimelineSlider from "./TimelineSlider.jsx";
import ToggleLayerControl from "./ToggleLayerControl.jsx";

const CustomLayersControl = ({
  onToggleBorders1880,
  isBordersVisible1880,
  onToggleBorders1945,
  isBordersVisible1945,

  onToggleMigrationLines,
  isMigrationLinesVisible,
  
  onBasemapChange,
  birthDecades,
  onDecadeChange,
}) => {
  return (
    <div className="layer-controls-container">
      {/* Migration Lines Toggle Row */}
      <div className="layer-controls-row">
        <h4 className="timelineTitle">Filter by Decade</h4>
      </div>

      {/* Timeline Slider Row */}
      <div className="layer-controls-row">
        <TimelineSlider birthDecades={birthDecades} onDecadeChange={onDecadeChange} />
      </div>
      <div className="layer-controls-row">
        <h3>
        <ToggleLayerControl
          label="Show Migration Lines"
          isChecked={isMigrationLinesVisible}
          onToggle={onToggleMigrationLines}
        />
        </h3>
      </div>
    </div>
  );
};

export default CustomLayersControl;
