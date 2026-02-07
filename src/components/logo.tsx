
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 40 }: LogoProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* तुम्ही दिलेला SVG कोड खालीलप्रमाणे येथे जसाच्या तसा टाकता येईल */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fill="currentColor"
          fontSize="24"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          MSP
        </text>
      </svg>
    </div>
  );
}
