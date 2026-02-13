import React from 'react';

export const XCircleGrayIcon: React.FC<{
    width?: number;
    height?: number;
    className?: string;
    color?: string;
}> = ({ width = 24, height = 24, className, color = '#256EF4' }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 14 14" fill="none" className={className}>
            <rect x="13.3334" width="13.3333" height="13.3333" rx="6.66667" transform="rotate(90 13.3334 0)" fill="#CDD1D5" />
            <path fillRule="evenodd" clipRule="evenodd" d="M4.04327 3.28951C3.83499 3.08123 3.4973 3.08123 3.28902 3.28951C3.08074 3.49779 3.08074 3.83548 3.28902 4.04376L5.91242 6.66716L3.29006 9.28951C3.08178 9.49779 3.08178 9.83548 3.29006 10.0438C3.49834 10.252 3.83603 10.252 4.04431 10.0438L6.66667 7.4214L9.28902 10.0438C9.4973 10.252 9.83499 10.252 10.0433 10.0438C10.2515 9.83548 10.2515 9.49779 10.0433 9.28951L7.42091 6.66716L10.0443 4.04376C10.2526 3.83548 10.2526 3.49779 10.0443 3.28951C9.83603 3.08123 9.49834 3.08123 9.29006 3.28951L6.66667 5.91291L4.04327 3.28951Z" fill="#33363D" />
        </svg>
    );
}