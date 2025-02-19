import React, { useEffect, useState } from 'react';

const Sidebar = ({ isCollapsed, setIsCollapsed, sidebarContent }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLandscapeMobile, setIsLandscapeMobile] = useState(false);
  const [isLandscapeDesktop, setIsLandscapeDesktop] = useState(window.innerWidth > 1025 && window.matchMedia("(orientation: landscape)").matches);

  useEffect(() => {
    const handleResize = () => {
      const isMobileDevice = window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
      setIsLandscapeMobile(window.innerWidth <= 1024 && window.matchMedia("(orientation: landscape)").matches); // Check for landscape mobile
      setIsLandscapeDesktop(window.innerWidth > 1024 && window.matchMedia("(orientation: landscape)").matches); // Check for landscape desktop
   };

    // Initial check to correctly set state when the component loads
    handleResize();

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const renderDetails = () => {
    if (typeof sidebarContent === 'string') {
      return <p>{sidebarContent}</p>;
    }

    return (
      <div>
        <h2>{sidebarContent.name_short}</h2>
        <p><strong>Full name:</strong> {sidebarContent.name}</p>
        <p><strong>Relation:</strong> {sidebarContent.relation}</p>
        <p><strong>Gender:</strong> {sidebarContent.gender}</p>
        <h2 className="timeline">Birth and Migration Decades</h2>
        
       {/* Conditional Line Segment Sections */}
      {isMobile && (
        <div className="line-segment mobile-line-segment">
          {/* Point A - Birth */}
          <div className="point">
            <div className="point-label above">{sidebarContent.birth_decade}</div>
            <div className="point-circle"></div>
            <div className="point-label below">
              {sidebarContent.birth_loc === sidebarContent.birth_modern ? (
                <span>{sidebarContent.birth_loc}</span>
              ) : (
                <>
                  {sidebarContent.birth_loc} <br /> Today: {sidebarContent.birth_modern}
                </>
              )}
            </div>
          </div>
          {/* Line */}
          <div className="line"></div>
          {/* Point B - Migration */}
          <div className="point">
            <div className="point-label above">{sidebarContent.migrate_decade}</div>
            <div className="point-circle"></div>
            <div className="point-label below">
              {sidebarContent.destination === sidebarContent.destination_modern ? (
                <span>{sidebarContent.destination}</span>
              ) : (
                <>
                  {sidebarContent.destination} <br /> Today: {sidebarContent.destination_modern}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isLandscapeDesktop && (
        <div className="line-segment landscape-line-segment">
          <div className="line-segment-content">
            <div className="line-column">
              {/* Point A */}
              <div className="point-circle a"></div>
              <div className="line"></div>
              <div className="point-circle b"></div>
            </div>
            <div className="labels-column">
              {/* Birth Information */}
              <div className="point-label-container">
                <div className="point-main-label">{sidebarContent.birth_decade}</div>
                <div className="point-details">
                  {sidebarContent.birth_loc === sidebarContent.birth_modern ? (
                    <span>{sidebarContent.birth_loc}</span>
                  ) : (
                    <>
                      {sidebarContent.birth_loc} <br /> Today: {sidebarContent.birth_modern}
                    </>
                  )}
                </div>
              </div>
              {/* Migration Information */}
              <div className="point-label-container">
                <div className="point-main-label">{sidebarContent.migrate_decade}</div>
                <div className="point-details">
                  {sidebarContent.destination === sidebarContent.destination_modern ? (
                    <span>{sidebarContent.destination}</span>
                  ) : (
                    <>
                      {sidebarContent.destination} <br /> Today: {sidebarContent.destination_modern}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLandscapeMobile && (
        <div className="line-segment mobile-landscape-line-segment">
          <div className="line-segment-content">
            <div className="line-column">
              {/* Point A */}
              <div className="point-circle a"></div>
              <div className="line"></div>
              <div className="point-circle b"></div>
            </div>
            <div className="labels-column">
              {/* Birth Information */}
              <div className="point-label-container">
                <div className="point-main-label">{sidebarContent.birth_decade}</div>
                <div className="point-details">
                  {sidebarContent.birth_loc === sidebarContent.birth_modern ? (
                    <span>{sidebarContent.birth_loc}</span>
                  ) : (
                    <>
                      {sidebarContent.birth_loc} <br /> Today: {sidebarContent.birth_modern}
                    </>
                  )}
                </div>
              </div>
              {/* Migration Information */}
              <div className="point-label-container">
                <div className="point-main-label">{sidebarContent.migrate_decade}</div>
                <div className="point-details">
                  {sidebarContent.destination === sidebarContent.destination_modern ? (
                    <span>{sidebarContent.destination}</span>
                  ) : (
                    <>
                      {sidebarContent.destination} <br /> Today: {sidebarContent.destination_modern}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

        <p> </p>
        <p><strong>Primary Language Spoken in Childhood:</strong> {sidebarContent.primary_lang}</p>
        <p><strong>Other Languages Spoken:</strong> {sidebarContent.other_lang}</p>
        <p><strong>Jewish?:</strong> {sidebarContent.jewish_yn}</p>
        <p><strong>Migrated?:</strong> {sidebarContent.migrate_yn}</p>
        <p className="other-info">
          <strong>Other Info:</strong> <span>{sidebarContent.other_info}</span>
        </p>
      </div>
    );
  };

  return (
    <div 
      className={`sidebar 
        ${isMobile ? ('mobile-sidebar') : (isLandscapeMobile ? 'mobile-landscape-sidebar':'desktop-sidebar')} 
        ${isCollapsed ? 'collapsed' : ''}`}
    > 
    
    {isMobile && (
      <button 
        className={`hide-button ${isCollapsed || !sidebarContent ? 'disabled' : ''}`} 
        onClick={toggleSidebar}
        disabled={isCollapsed && !sidebarContent}
      >
        {isCollapsed ? "▲" : "▼"}
      </button>
    )}

    {(isLandscapeDesktop || isLandscapeMobile) && (
      <button 
        className={`hide-button ${isCollapsed || !sidebarContent ? 'disabled' : ''}`} 
        onClick={toggleSidebar}
        disabled={isCollapsed && !sidebarContent}
      >
        {isCollapsed ? "◀" : "▶"}
      </button>
    )}

    <h3>Ancestor Details</h3>
    
    {isCollapsed || !sidebarContent ? (
      <p className="centered-text">Click on a point to show details</p>
    ) : (
      <div>{renderDetails()}</div>
    )}

  </div>
  );
};

export default Sidebar;
