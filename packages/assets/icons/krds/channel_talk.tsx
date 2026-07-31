import React from "react";

export const ChannelTalkIcon: React.FC<{
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
      <circle cx="12" cy="12" r="12" fill="#5B31F4" />
      <path
        d="M18.25 11.2C18.25 7.74 15.44 5.5 12 5.5C8.56 5.5 5.75 7.74 5.75 11.2C5.75 14.66 8.56 16.9 12 16.9C12.81 16.9 13.57 16.78 14.22 16.55L17.3 17.31C17.73 17.42 18.08 17.02 17.95 16.6L17.08 13.83C17.83 13.08 18.25 12.18 18.25 11.2Z"
        fill="white"
      />
      <path
        d="M9 11.55C9.62 12.47 10.7 13.02 12 13.02C13.3 13.02 14.38 12.47 15 11.55"
        stroke="#5B31F4"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
    </svg>
  );
};
