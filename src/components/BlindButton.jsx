import React from "react";
import { speak } from "../utils/speech";

export default function BlindButton({ 
  label, 
  onActivate, 
  children, 
  className 
}) {
  // Single Tap: Read name + purpose
  const handleSingleClick = (e) => {
    e.stopPropagation();
    speak(label); 
  };

  // Double Tap: Execute action
  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (onActivate) onActivate();
  };

  return (
    <button
      onClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
      className={className}
      aria-label={label}
    >
      {children}
    </button>
  );
}