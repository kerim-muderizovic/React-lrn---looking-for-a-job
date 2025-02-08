import React from "react";
import './isLoading.css'; // Import your CSS file

const Loading = () => {
  return (
    <div className="div">
      <div className="three-body">
        <div className="three-body__dot"></div>
        <div className="three-body__dot"></div>
        <div className="three-body__dot"></div>
      </div>
    </div>
  );
};

export default Loading;