import React from 'react';

const Logo = ({ height = "50px" }) => {
    return (
        <svg
            width={height}
            height={height}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block' }}
        >
            {/* Criclket Bat */}
            <path
                d="M38.5 78.5L21.5 95.5C20.1 96.9 17.9 96.9 16.5 95.5L4.5 83.5C3.1 82.1 3.1 79.9 4.5 78.5L21.5 61.5L38.5 78.5Z"
                fill="#D4AF37"
            />
            <path
                d="M87.5 12.5L30 70L47 87L104.5 29.5C106.5 27.5 106.5 24.5 104.5 22.5L94.5 12.5C92.5 10.5 89.5 10.5 87.5 12.5Z"
                fill="#D4AF37"
            />
            {/* Ball */}
            <circle cx="75" cy="75" r="15" fill="#C8102E" />
            <path d="M68 63C70 65 77 65 82 63" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M63 70C65 72 65 79 63 84" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
};

export default Logo;
