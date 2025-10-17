import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface QualityPanelProps {
  roll: number;
  yaw: number;
  ipd: number;
  rollThreshold?: number;
  yawThreshold?: [number, number];
}

export const QualityPanel = ({ 
  roll, 
  yaw, 
  ipd,
  rollThreshold = 8,
  yawThreshold = [0.85, 1.15]
}: QualityPanelProps) => {
  const hasIssues = Math.abs(roll) > rollThreshold || yaw < yawThreshold[0] || yaw > yawThreshold[1] || ipd < 120;

  const issues: string[] = [];
  if (Math.abs(roll) > rollThreshold) issues.push("Head is tilted");
  if (yaw < yawThreshold[0] || yaw > yawThreshold[1]) issues.push("Head is turned to the side");
  if (ipd < 120) issues.push("Low resolution or face too far");

  if (!hasIssues) {
    return (
      <Alert className="glass-card border-green-500/50 bg-green-500/10">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-500">
          ✓ Photo quality is good! All measurements are reliable.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="glass-card border-yellow-500/50 bg-yellow-500/10">
      <AlertCircle className="h-4 w-4 text-yellow-500" />
      <AlertDescription className="text-yellow-500">
        <strong>Photo Quality Issues:</strong>
        <ul className="list-disc list-inside mt-2">
          {issues.map((issue, i) => (
            <li key={i}>{issue}</li>
          ))}
        </ul>
        <p className="mt-2 text-sm">
          For best results: face camera directly, keep head straight, use good lighting, and ensure face is clearly visible.
        </p>
      </AlertDescription>
    </Alert>
  );
};
