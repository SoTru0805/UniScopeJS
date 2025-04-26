import { Star as StarIcon, StarHalf } from "lucide-react";

interface StarProps {
  type: "full" | "half" | "empty";
  color?: string;
  size?: number;
}

export function Star({ type, color = "black", size = 24 }: StarProps) {
  const commonProps = {
    color,
    size,
  };

  switch (type) {
    case "full":
      return <StarIcon {...commonProps} fill={color} />;
    case "half":
      return <StarHalf {...commonProps} fill={color} />;
    case "empty":
      return <StarIcon {...commonProps} fill="none" />; // just outline, no fill!
    default:
      return <StarIcon {...commonProps} fill="none" />;
  }
}
