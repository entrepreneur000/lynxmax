import { Shield, Lock, Eye, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl page-transition">
      <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
        Privacy & Security
      </h1>

      <div className="space-y-6">
        <Card className="glass-card border-primary/50 neon-glow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">Your Privacy is Our Priority</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">
              Lynxmax is designed with privacy-first principles. All facial analysis happens 
              directly in your browser—no servers, no cloud processing, no data collection.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <Lock className="w-8 h-8 text-primary mb-2" />
              <CardTitle>No Data Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your photos never leave your device. All image processing and analysis 
                happens locally using your browser's computing power.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <Server className="w-8 h-8 text-primary mb-2" />
              <CardTitle>No Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We don't store any images, results, or personal information on any server. 
                Once you close the page, all data is gone.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <Eye className="w-8 h-8 text-primary mb-2" />
              <CardTitle>No Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We don't use cookies, analytics, or tracking scripts to monitor your activity 
                or collect usage data.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <Shield className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Open Source Tech</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Built with face-api.js, an open-source library, ensuring transparency 
                and security in our facial analysis technology.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. You Upload</h3>
              <p className="text-sm text-muted-foreground">
                When you select a photo, it's loaded into your browser's memory only. 
                It never touches our servers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Browser Processes</h3>
              <p className="text-sm text-muted-foreground">
                The face-api.js library runs entirely in your browser, detecting facial 
                landmarks and calculating measurements locally.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Results Display</h3>
              <p className="text-sm text-muted-foreground">
                Analysis results are shown directly in your browser. No data is sent anywhere.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4. You Control</h3>
              <p className="text-sm text-muted-foreground">
                You can clear images at any time. Closing the tab or browser removes all traces 
                of your analysis session.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-green-500/30 bg-green-500/5">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              Verification
            </h3>
            <p className="text-sm text-muted-foreground">
              You can verify our privacy claims by checking your browser's network tab. 
              You'll see that no image data is transmitted to any server during analysis. 
              The only network requests are for loading the face detection models from a CDN.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Ethical Use</h3>
            <p className="text-sm text-muted-foreground">
              Please use this tool responsibly and ethically. Do not use it to judge others 
              or make harmful comparisons. Remember that facial measurements are just one aspect 
              of appearance, and true beauty is multifaceted and subjective.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
