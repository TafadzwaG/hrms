import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg 
            {...props} 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Main Center Figure (The Leader/Employee) */}
            <circle cx="12" cy="7" r="4" />
            <path d="M12 13c-4.42 0-8 2.58-8 6v2h16v-2c0-3.42-3.58-6-8-6z" />
            
            {/* Side Figure Left (The Team) */}
            <circle cx="5" cy="9" r="3" opacity="0.5" />
            <path d="M5 14c-3.31 0-6 1.94-6 4.5V20h5v-1.5c0-1.7 1.3-3.1 3-4.2-.7-.2-1.3-.3-2-.3z" opacity="0.5" />
            
            {/* Side Figure Right (The Team) */}
            <circle cx="19" cy="9" r="3" opacity="0.5" />
            <path d="M19 14c.7 0 1.3.1 2 .3 1.7 1.1 3 2.5 3 4.2V20h-5v-1.5c0-2.56-2.69-4.5-6-4.5z" opacity="0.5" />
        </svg>
    );
}