import React from "react";

export const InstagramIcon: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ width = 24, height = 24, className }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient
          id="instagram-gradient"
          x1="20.5"
          y1="1"
          x2="3.5"
          y2="23"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#833AB4" />
          <stop offset="0.48" stopColor="#E1306C" />
          <stop offset="1" stopColor="#FCAF45" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="12" fill="url(#instagram-gradient)" />
      <rect
        x="6.25"
        y="6.25"
        width="11.5"
        height="11.5"
        rx="3.25"
        stroke="white"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="2.7" stroke="white" strokeWidth="1.5" />
      <circle cx="15.85" cy="8.2" r="0.85" fill="white" />
    </svg>
  );
};
