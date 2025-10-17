import { Camera, Shield, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl page-transition">
      <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
        About Lynxmax
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              Lynxmax is an advanced facial analysis tool that uses artificial intelligence to measure 
              facial symmetry, proportions, and harmony. Built with cutting-edge face detection technology, 
              it analyzes over 19 different facial metrics to provide comprehensive insights into facial aesthetics.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 my-8">
          <Card className="glass-card hover:scale-105 transition-transform">
            <CardHeader>
              <Camera className="w-10 h-10 text-primary mb-2" />
              <CardTitle>AI-Powered Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Uses advanced face-api.js with 68-point facial landmark detection for precise measurements
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:scale-105 transition-transform">
            <CardHeader>
              <Shield className="w-10 h-10 text-primary mb-2" />
              <CardTitle>100% Private</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All processing happens in your browser. Your photos never leave your device
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:scale-105 transition-transform">
            <CardHeader>
              <TrendingUp className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Comprehensive Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                19+ facial measurements including symmetry, proportions, and harmony scores
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>How to Take a Good Photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold">1.</span>
              <p className="text-muted-foreground">
                <strong>Face the camera directly</strong> – Keep your head straight, not tilted or turned
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold">2.</span>
              <p className="text-muted-foreground">
                <strong>Neutral expression</strong> – Relax your face, no smiling or exaggerated expressions
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold">3.</span>
              <p className="text-muted-foreground">
                <strong>Good lighting</strong> – Use natural light or bright indoor lighting, avoid harsh shadows
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold">4.</span>
              <p className="text-muted-foreground">
                <strong>Clear image</strong> – Ensure your face is in focus and fills most of the frame
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold">5.</span>
              <p className="text-muted-foreground">
                <strong>No obstructions</strong> – Remove glasses, hats, or hair covering your face
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-primary/30">
          <CardHeader>
            <CardTitle>What We Measure</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <strong>Facial Symmetry:</strong> Left-right balance and deviation from midline</li>
              <li>• <strong>Proportions:</strong> Golden ratio measurements and facial thirds</li>
              <li>• <strong>Eye Features:</strong> Canthal tilt, IPD, and eye shape</li>
              <li>• <strong>Nose Features:</strong> Width, length, and proportion to face</li>
              <li>• <strong>Jaw & Chin:</strong> Jawline definition, gonial angle, and chin projection</li>
              <li>• <strong>Overall Harmony:</strong> How well all features work together</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-card border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> This tool is for educational and entertainment purposes only. 
              Facial attractiveness is highly subjective and influenced by cultural, personal, and contextual factors. 
              These measurements are mathematical approximations and should not be taken as definitive assessments of beauty or self-worth.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
