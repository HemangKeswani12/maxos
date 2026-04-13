import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
};

export function MaxOSLogo({ size = "md", className = "" }: LogoProps) {
  return (
    <span className={`${sizeMap[size]} tracking-tight ${className}`} style={{ fontFamily: "Verdana, sans-serif" }}>
      <span style={{ fontWeight: 900, color: "#5ab3cc" }}>be</span>
      <span style={{ fontWeight: 400, color: "#ffffff" }}>maxxed</span>
    </span>
  );
}
