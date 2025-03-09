
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  status?: "online" | "offline" | "away" | "busy";
}

const Avatar = ({
  src = "/placeholder.svg",
  alt = "Avatar",
  size = "md",
  className,
  status
}: AvatarProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-slate-400",
    away: "bg-amber-500",
    busy: "bg-red-500"
  };

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          "rounded-full overflow-hidden border-2 border-white shadow-md",
          sizeClasses[size],
          className
        )}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      {status && (
        <span 
          className={cn(
            "absolute bottom-0 right-0 block rounded-full border-2 border-white",
            size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4",
            statusColors[status]
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
