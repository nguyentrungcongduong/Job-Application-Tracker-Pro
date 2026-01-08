import React from 'react';

interface LogoProps {
    className?: string;
    size?: number;
}

const Logo: React.FC<LogoProps> = ({ className, size = 48 }) => {
    return (
        <svg
            viewBox="0 0 400 400"
            width={size}
            height={size}
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FFE259', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#FFA751', stopOpacity: 1 }} />
                </linearGradient>

                <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#667EEA', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#4C5FD5', stopOpacity: 1 }} />
                </linearGradient>

                <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FFD4A3', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#FFBC7A', stopOpacity: 1 }} />
                </linearGradient>

                <radialGradient id="bgGrad" cx="50%" cy="50%">
                    <stop offset="0%" style={{ stopColor: '#1a1a2e', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#0f0f1e', stopOpacity: 1 }} />
                </radialGradient>

                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                    <feOffset dx="0" dy="2" result="offsetblur" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Background with slight zoom-in effect - reduced circle radius slightly to pull focus */}
            <circle cx="200" cy="200" r="190" fill="url(#bgGrad)" />

            {/* Decorative elements made more prominent */}
            <circle cx="80" cy="100" r="50" fill="#667EEA" opacity="0.15" />
            <circle cx="320" cy="300" r="60" fill="#FFE259" opacity="0.12" />

            {/* Scaled up props and moved closer to character */}
            <g transform="translate(290, 240) scale(1.15)" filter="url(#shadow)">
                <rect x="-32" y="-28" width="64" height="56" rx="6" fill="url(#yellowGrad)" />
                <rect x="-32" y="-28" width="64" height="10" fill="#FFA751" opacity="0.5" />
                <path d="M -15 -28 L -15 -36 Q 0 -42 15 -36 L 15 -28" fill="none" stroke="#FFA751" strokeWidth="5" strokeLinecap="round" />
                <rect x="-5" y="-5" width="10" height="15" rx="2" fill="#1a1a2e" opacity="0.3" />
                <circle cx="0" cy="5" r="3" fill="#1a1a2e" />
            </g>

            <g transform="translate(110, 210) scale(1.15)" filter="url(#shadow)">
                <rect x="-28" y="-40" width="56" height="80" rx="4" fill="#E8EAED" />
                <rect x="-24" y="-36" width="48" height="72" rx="3" fill="#FFFFFF" />

                <rect x="-10" y="-45" width="20" height="10" rx="4" fill="#667EEA" />

                <g stroke="url(#yellowGrad)" strokeWidth="4" strokeLinecap="round" fill="none" filter="url(#glow)">
                    <polyline points="-16,-24 -10,-18 -4,-28" />
                    <polyline points="-16,-6 -10,0 -4,-10" />
                </g>
            </g>

            {/* Primary Character scaled up and centered */}
            <g transform="translate(200, 185) scale(1.2)" filter="url(#shadow)">
                {/* Body */}
                <ellipse cx="0" cy="35" rx="38" ry="45" fill="url(#blueGrad)" />

                {/* Arms */}
                <ellipse cx="-40" cy="28" rx="13" ry="22" fill="url(#blueGrad)" transform="rotate(-15 -40 28)" />
                <circle cx="-48" cy="45" r="9" fill="url(#skinGrad)" />

                <ellipse cx="38" cy="32" rx="12" ry="20" fill="url(#blueGrad)" transform="rotate(20 38 32)" />
                <circle cx="45" cy="48" r="9" fill="url(#skinGrad)" />

                {/* Head */}
                <circle cx="0" cy="-12" r="44" fill="url(#skinGrad)" />

                {/* Hair */}
                <path d="M -35 -18 Q -42 -42 -25 -52 Q -12 -58 0 -56 Q 12 -58 25 -52 Q 42 -42 35 -18 Q 30 -25 20 -28 Q 10 -30 0 -30 Q -10 -30 -20 -28 Q -30 -25 -35 -18" fill="#2d3561" />
                <ellipse cx="-28" cy="-22" rx="10" ry="11" fill="#2d3561" />
                <ellipse cx="28" cy="-22" rx="10" ry="11" fill="#2d3561" />

                {/* Face */}
                <ellipse cx="-14" cy="-10" r="6" fill="#1a1a2e" />
                <ellipse cx="14" cy="-10" r="6" fill="#1a1a2e" />
                <ellipse cx="-12" cy="-12" rx="2.5" ry="3" fill="#FFFFFF" />
                <ellipse cx="16" cy="-12" rx="2.5" ry="3" fill="#FFFFFF" />

                {/* Smile */}
                <path d="M -12 8 Q 0 15 12 8" fill="none" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />

                {/* Tie */}
                <path d="M 0 28 L -10 28 L 0 50 L 10 28 Z" fill="url(#yellowGrad)" />
                <circle cx="0" cy="28" r="3" fill="#FFA751" />
            </g>
        </svg>
    );
};

export default Logo;
