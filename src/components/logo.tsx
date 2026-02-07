
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 40 }: LogoProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Laurel/Wheat Wreath - Blue */}
        <path
          d="M25 78C15 68 12 53 15 38M75 78C85 68 88 53 85 38"
          stroke="#0056D2"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M12 73L18 67M10 61L17 58M10 48L17 48M12 35L18 41" stroke="#0056D2" strokeWidth="2.5" />
        <path d="M88 73L82 67M90 61L83 58M90 48L83 48M88 35L82 41" stroke="#0056D2" strokeWidth="2.5" />

        {/* Globe Base - Deep Blue */}
        <circle cx="50" cy="45" r="34" fill="#0056D2" />
        
        {/* Map/Continents Representation (White/Transparent) */}
        <path
          d="M32 38C38 33 58 33 68 38C72 48 62 60 50 63C38 60 28 48 32 38Z"
          fill="white"
          fillOpacity="0.25"
        />
        <path d="M28 45Q40 40 50 50Q60 60 72 55" stroke="white" strokeWidth="0.8" strokeOpacity="0.4" />

        {/* Central Human-Sprout Figure - White */}
        <path
          d="M50 64V46"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Leaf-like Arms (Sprouting) */}
        <path
          d="M50 50C44 42 32 40 25 45C30 40 40 38 50 46"
          fill="white"
        />
        <path
          d="M50 55C44 50 32 50 25 55C30 50 40 48 50 53"
          fill="white"
        />
        <path
          d="M50 50C56 42 68 40 75 45C70 40 60 38 50 46"
          fill="white"
        />
         <path
          d="M50 55C56 50 68 50 75 55C70 50 60 48 50 53"
          fill="white"
        />
        {/* Head of the figure */}
        <circle cx="50" cy="38" r="6" fill="white" />

        {/* MSP Text at Bottom - Bold Blue */}
        <text
          x="50"
          y="96"
          textAnchor="middle"
          fill="#0056D2"
          fontSize="24"
          fontWeight="900"
          fontFamily="sans-serif"
          letterSpacing="1"
        >
          MSP
        </text>
      </svg>
    </div>
  );
}
