
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
        className="text-primary"
      >
        {/* Outer Laurel/Wreath representation */}
        <path
          d="M20 70C10 60 10 40 20 30M80 70C90 60 90 40 80 30"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Globe Circle */}
        <circle cx="50" cy="45" r="35" stroke="currentColor" strokeWidth="2" />
        <path
          d="M15 45H85M50 10V80"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
        {/* Central Figure/Sprout */}
        <path
          d="M50 65V45M50 45C40 40 35 30 35 30M50 45C60 40 65 30 65 30M50 40C50 35 55 30 55 30M50 40C50 35 45 30 45 30"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="50" cy="38" r="4" fill="currentColor" />
        {/* MSP Text */}
        <text
          x="50"
          y="95"
          textAnchor="middle"
          fill="currentColor"
          fontSize="18"
          fontWeight="900"
          fontFamily="sans-serif"
        >
          MSP
        </text>
      </svg>
    </div>
  );
}
