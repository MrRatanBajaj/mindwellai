import logo from "@/assets/wellmindai-logo-2.png";

interface BrandLogoProps {
  /** pixel size of the logo mark */
  size?: number;
  /** show the WellMindAI wordmark next to the mark */
  withText?: boolean;
  className?: string;
  textClassName?: string;
}

/**
 * Single source of truth for the WellMindAI brand mark.
 * Always rendered inside a soft light container so the mark stays
 * clearly visible on both light and dark sections.
 */
const BrandLogo = ({ size = 40, withText = true, className = "", textClassName = "" }: BrandLogoProps) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <span
      className="inline-flex items-center justify-center rounded-2xl bg-card/95 backdrop-blur-md border border-foreground/10 shadow-sm p-1"
      style={{ width: size, height: size }}
    >
      <img
        src={logo}
        alt="WellMindAI logo"
        width={size}
        height={size}
        className="w-full h-full object-contain"
        loading="eager"
      />
    </span>
    {withText && (
      <span className={`font-display text-2xl tracking-tight text-foreground ${textClassName}`}>
        WellMindAI
      </span>
    )}
  </span>
);

export default BrandLogo;
