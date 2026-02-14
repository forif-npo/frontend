import React from "react";

export const KakaotalkIcon: React.FC<{
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
      <circle cx="12" cy="12" r="12" fill="#FEE500" />
      <path
        d="M12 6.2C8.134 6.2 5 8.707 5 11.8c0 1.97 1.306 3.7 3.27 4.689l-.838 3.108c-.073.27.237.486.476.334l3.519-2.35c.186.015.374.023.573.023 3.866 0 7-2.507 7-5.604C19 8.707 15.866 6.2 12 6.2z"
        fill="#3C1E1E"
      />
    </svg>
  );
};
