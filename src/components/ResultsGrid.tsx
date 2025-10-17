import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface Metric {
  name: string;
  value: string;
  feedback: string;
  confidence: "high" | "medium" | "low";
  icon?: string;
}

interface ResultsGridProps {
  metrics: Metric[];
  overallScore: number;
  harmonySummary: string;
}

export const ResultsGrid = ({ metrics, overallScore, harmonySummary }: ResultsGridProps) => {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Overall Score */}
      <Card className="glass-card border-primary/50 neon-glow">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center justify-between">
            <span>Overall Attractiveness Score</span>
            <Badge variant="secondary" className="text-3xl px-6 py-2 bg-primary text-primary-foreground">
              {overallScore}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{harmonySummary}</p>
          <p className="text-xs text-muted-foreground mt-2">
            * Subjective heuristic score for entertainment purposes only. Not a medical assessment.
          </p>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="glass-card hover:scale-105 transition-transform duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>{metric.name}</span>
                <span
                  className={`w-2 h-2 rounded-full ${getConfidenceColor(
                    metric.confidence
                  )}`}
                  title={`Confidence: ${metric.confidence}`}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-2xl font-bold text-primary">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.feedback}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
