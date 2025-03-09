
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  actionText?: string;
  onAction?: () => void;
}

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  className,
  actionText,
  onAction,
}: FeatureCardProps) => {
  return (
    <div
      className={cn(
        "glass-panel rounded-xl p-6 hover-lift",
        className
      )}
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-mindwell-50 text-mindwell-600 mb-5">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-600 text-sm mb-4">{description}</p>
      
      {actionText && onAction && (
        <Button 
          onClick={onAction}
          variant="outline" 
          className="mt-2 border-mindwell-200 text-mindwell-700 hover:bg-mindwell-50"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default FeatureCard;
