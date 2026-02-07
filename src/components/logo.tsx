/** 
 * This file is deprecated. 
 * Please use <img src="/logo.svg" /> instead of importing this component.
 */
export function Logo({ className, size = 40 }: { className?: string; size?: number }) {
  return <img src="/logo.svg" alt="MSP Logo" width={size} height={size} className={className} />;
}