
import React from "react";
import { Button } from "@/components/ui/button";

export type AvatarType = {
  key: string;
  name: string;
  style: React.CSSProperties;
};

type AvatarSelectorProps = {
  avatars: AvatarType[];
  selected: string;
  setSelected: (key: string) => void;
};

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  avatars,
  selected,
  setSelected,
}) => (
  <div className="flex flex-wrap items-center justify-center mb-3 gap-2">
    <span className="text-xs text-gray-500 mr-2">Avatar:</span>
    {avatars.map((a) => (
      <Button
        key={a.key}
        size="sm"
        variant={selected === a.key ? "secondary" : "outline"}
        className={`px-3 py-1 rounded-lg text-xs ${selected === a.key ? "font-semibold" : ""}`}
        onClick={() => setSelected(a.key)}
        style={selected === a.key ? a.style : undefined}
      >
        {a.name}
      </Button>
    ))}
  </div>
);

export default AvatarSelector;
