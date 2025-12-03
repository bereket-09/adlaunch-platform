import { Play } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  const textClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-orange`}>
        <Play className="text-primary-foreground fill-current" size={size === "lg" ? 28 : size === "md" ? 22 : 18} />
      </div>
      {showText && (
        <span className={`${textClasses[size]} font-bold text-foreground`}>
          AdView<span className="text-primary">Pro</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
