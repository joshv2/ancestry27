import React, { useState, useEffect } from "react";
import './MapComponent.css'; // Import the stylesheet

const TimelineSlider = ({ 
  birthDecades, 
  onDecadeChange, 
  onCollapse,
  isMigrationLinesVisible
}) => {
  // console.log("TimelineSlider props:", { isMigrationLinesVisible, onCollapse });

  const [sortedDecades, setSortedDecades] = useState([]);
  const [selectedDecade, setSelectedDecade] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLandscapeMobile, setIsLandscapeMobile] = useState(false);
  const [isLandscapeDesktop, setIsLandscapeDesktop] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // console.log("Updated onCollapse function:", onCollapse);
  }, [onCollapse]);

  useEffect(() => {
    // Sort the birthDecades array
    const sorted = birthDecades
      .filter((decade) => decade !== 'Unknown') // Remove 'Unknown'
      .sort((a, b) => {
        if (a === 'Before 1850') return -1; // Ensure 'Before 1850' is at the top
        if (b === 'Before 1850') return 1;
        return a.localeCompare(b); // Sort other decades alphabetically
      });

    setSortedDecades(['All', ...sorted]); // Add 'All' at the beginning
    setSelectedDecade('All'); // Set default selected decade
  }, [birthDecades]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsLandscapeMobile(window.innerWidth <= 1024 && window.matchMedia("(orientation: landscape)").matches); // Check for landscape mobile
      setIsLandscapeDesktop(window.innerWidth > 1024 && window.matchMedia("(orientation: landscape)").matches); // Check for landscape desktop
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  const handleSliderChange = (event) => {
    const index = parseInt(event.target.value, 10);
    const decade = sortedDecades[index];
    setSelectedDecade(decade);
    setCurrentIndex(index);
    onDecadeChange(decade); // Notify parent component
    if (typeof onCollapse === "function") {
      console.log("Calling onCollapse...");
      onCollapse();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setSelectedDecade(sortedDecades[newIndex]);
      onDecadeChange(sortedDecades[newIndex]);
      if (typeof onCollapse === "function") {
        console.log("Calling onCollapse...");
        onCollapse();
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < sortedDecades.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedDecade(sortedDecades[newIndex]);
      onDecadeChange(sortedDecades[newIndex]);
      if (typeof onCollapse === "function") {
        console.log("Calling onCollapse... ✅");
        onCollapse();
      } else {
        console.error("onCollapse is NOT a function! ❌");
      }
    }
  };

  return (
    <div className="timeline-slider-container">
      {/* For mobile or landscape mobile, use arrows */}
      {isMobile || isLandscapeMobile ? (
        <div className="timeline-arrows">
          <button
            className="arrow-button left"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ‹
          </button>
          <span className="timeline-text">{selectedDecade}</span>
          <button
            className="arrow-button right"
            onClick={handleNext}
            disabled={currentIndex === sortedDecades.length - 1}
          >
            ›
          </button>
        </div>
      ) : (
        /* For laptop size and larger, keep the timeline slider */
        <div className="slider-wrapper">
          <input
            type="range"
            className="timeline-slider"
            min="0"
            max={sortedDecades.length - 1}
            value={currentIndex}
            onChange={handleSliderChange}
          />
          <div className="tick-marks">
            {sortedDecades.map((decade, index) => (
              <div
                key={index}
                className={`tick ${selectedDecade === decade ? "active" : ""}`}
                style={{ left: `${(index / (sortedDecades.length - 1)) * 100}%` }}
              >
                <span className="tick-label">{decade}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineSlider;
  