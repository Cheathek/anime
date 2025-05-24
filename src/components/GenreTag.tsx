import React from "react";
import { cn, stringToColor } from "../utils/helpers";

interface GenreTagProps {
  name: string;
  className?: string;
}

const GenreTag: React.FC<GenreTagProps> = ({ name, className }) => {
  return (
    <span
      className={cn(
        "inline-block rounded px-2 py-1 text-xs font-medium",
        stringToColor(name),
        className
      )}
    >
      {name}
    </span>
  );
};

export default GenreTag;
