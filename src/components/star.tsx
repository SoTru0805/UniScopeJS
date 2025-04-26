import { Star as StarIcon, StarHalf, StarOff } from "lucide-react";

interface StarProps {
  type: "full" | "half" | "empty";
  color?: string;
}

export function Star({ type, color = "black" }: StarProps) {
  const starColor = color;
  
  switch (type) {
    case "full":
      return <StarIcon fill={starColor} color={starColor} />;
    case "half":
      return <StarHalf fill={starColor} color={starColor} />;
    case "empty":
      return <StarOff fill="none" color={starColor} />;
    default:
      return <StarOff fill="none" color={starColor} />;
  }
}