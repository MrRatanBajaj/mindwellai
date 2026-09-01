import logo from "@/assets/wellmindai-logo-2.png";

interface BrandLogoProps {
  /** maximum pixel size of the logo mark (scales down on small screens) */
  size?: number;
  /** show the WellMindAI wordmark next to the mark */
  withText?: boolean;
  className?: string;
  textClassName?: string;
}

/**
 * Single source of truth for the WellMindAI brand mark.
 * The mark scales fluidly with the viewport (never smaller than 76% of `size`,
 * never larger than `size`) so it stays crisp and balanced on every device.
 */
const BrandLogo = ({ size = 40, withText = true, className = "", textClassName = "" }: BrandLogoProps) => {
  const fluid = `clamp(${Math.round(size * 0.76)}px, ${(size / 16).toFixed(2)}rem + 0.4vw, ${size}px)`;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-foreground/10 bg-card/95 p-1 shadow-sm backdrop-blur-md"
        style={{ width: fluid, height: fluid }}
      >
        <img
          src={logo}
          alt="WellMindAI logo"
          width={size}
          height={size}
          className="h-full w-full object-contain"
          loading="eager"
        />
      </span>
      {withText && (
        <span
          className={`font-display tracking-tight text-foreground text-lg sm:text-xl md:text-2xl ${textClassName}`}
        >
          WellMindAI
        </span>
      )}
    </span>
  );
};

export default BrandLogo;
