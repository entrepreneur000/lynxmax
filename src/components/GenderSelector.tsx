import { Button } from "./ui/button";

interface GenderSelectorProps {
  selected: "male" | "female" | null;
  onSelect: (gender: "male" | "female") => void;
}

export const GenderSelector = ({ selected, onSelect }: GenderSelectorProps) => {
  return (
    <div className="glass-card p-6">
      <label className="block text-sm font-medium mb-3">Select Gender</label>
      <div className="flex gap-4">
        <Button
          variant={selected === "male" ? "default" : "outline"}
          className={`flex-1 ${selected === "male" ? "btn-primary" : ""}`}
          onClick={() => onSelect("male")}
        >
          Male
        </Button>
        <Button
          variant={selected === "female" ? "default" : "outline"}
          className={`flex-1 ${selected === "female" ? "btn-primary" : ""}`}
          onClick={() => onSelect("female")}
        >
          Female
        </Button>
      </div>
    </div>
  );
};
