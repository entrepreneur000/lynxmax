import { useState, useRef } from "react";
import { Loader2, Download } from "lucide-react";
import { UploadArea } from "@/components/UploadArea";
import { GenderSelector } from "@/components/GenderSelector";
import { CanvasOverlay } from "@/components/CanvasOverlay";
import { QualityPanel } from "@/components/QualityPanel";
import { ResultsGrid } from "@/components/ResultsGrid";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { analyzeFace, formatMetrics, calculateOverallScore, generateHarmonySummary } from "@/lib/faceAnalysis";

declare global {
  interface Window {
    faceapi: any;
  }
}

const Home = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [landmarks, setLandmarks] = useState<any>(null);
  const [results, setResults] = useState<any>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const loadModels = async () => {
    if (modelsLoaded) return;
    
    try {
      setLoadingStep("Loading AI models...");
      setLoadingProgress(10);
      
      const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";
      
      setLoadingProgress(30);
      setLoadingStep("Loading face detector...");
      await window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      
      setLoadingProgress(70);
      setLoadingStep("Loading landmark detector...");
      await window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      
      setLoadingProgress(100);
      setLoadingStep("Models loaded ✓");
      setModelsLoaded(true);
      
      setTimeout(() => setLoadingStep(""), 1000);
    } catch (error) {
      console.error("Error loading models:", error);
      setLoadingProgress(0);
      setLoadingStep("");
      toast({ 
        title: "Error loading models", 
        description: "Please refresh the page and try again",
        variant: "destructive" 
      });
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile || !gender || !imageRef.current) {
      toast({ 
        title: "Missing requirements", 
        description: "Please upload an image and select gender",
        variant: "destructive" 
      });
      return;
    }

    await loadModels();
    if (!modelsLoaded) return;

    setAnalyzing(true);
    setResults(null);
    setLoadingStep("Detecting face...");
    setLoadingProgress(20);
    
    try {
      const img = imageRef.current;
      
      // Detect face and landmarks with optimized settings
      const detection = await window.faceapi
        .detectSingleFace(img, new window.faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.5
        }))
        .withFaceLandmarks();
      
      setLoadingProgress(50);
      setLoadingStep("Analyzing landmarks...");

      if (!detection) {
        toast({ 
          title: "No face detected", 
          description: "Please ensure your face is clearly visible and well-lit",
          variant: "destructive" 
        });
        setAnalyzing(false);
        return;
      }

      setLandmarks(detection.landmarks);

      setLoadingProgress(70);
      setLoadingStep("Computing metrics...");
      
      // Analyze face
      const { metrics, quality } = analyzeFace(detection.landmarks);
      const formattedMetrics = formatMetrics(metrics, gender);
      const overallScore = calculateOverallScore(metrics, gender);
      const harmonySummary = generateHarmonySummary(overallScore, metrics, gender);
      
      setLoadingProgress(100);
      setLoadingStep("Analysis complete ✓");

      setResults({
        metrics: formattedMetrics,
        overallScore,
        harmonySummary,
        quality,
      });

      toast({ title: "✓ Analysis complete!", description: "Scroll down to view results" });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({ 
        title: "Analysis failed", 
        description: "An error occurred during analysis",
        variant: "destructive" 
      });
    } finally {
      setAnalyzing(false);
      setTimeout(() => {
        setLoadingStep("");
        setLoadingProgress(0);
      }, 2000);
    }
  };

  const handleImageSelect = (file: File, url: string) => {
    setImageFile(file);
    setImageUrl(url);
    setResults(null);
    setLandmarks(null);
  };

  const handleClear = () => {
    setImageFile(null);
    setImageUrl(null);
    setGender(null);
    setResults(null);
    setLandmarks(null);
  };

  const handleDownloadReport = async () => {
    if (!resultsRef.current || !imageRef.current || !results) return;

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // A4 dimensions: 210mm x 297mm
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Background gradient effect
      doc.setFillColor(10, 10, 20);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Header with accent
      doc.setFillColor(107, 138, 253);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      // Logo and Title
      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255);
      doc.text('🐆 Lynxmax Analysis Report', margin, 25);
      
      // Date
      doc.setFontSize(10);
      doc.setTextColor(220, 220, 220);
      doc.text(new Date().toLocaleDateString(), pageWidth - margin, 25, { align: 'right' });
      
      let yPos = 55;
      
      // Add image
      const img = imageRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const imgWidth = 80;
        const imgHeight = imgWidth / imgAspect;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        doc.addImage(imgData, 'JPEG', (pageWidth - imgWidth) / 2, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 15;
      }
      
      // Overall Score Box
      doc.setFillColor(30, 30, 40);
      doc.roundedRect(margin, yPos, contentWidth, 20, 3, 3, 'F');
      doc.setFontSize(16);
      doc.setTextColor(107, 138, 253);
      doc.text(`Overall Score: ${results.overallScore}/100`, pageWidth / 2, yPos + 13, { align: 'center' });
      yPos += 30;
      
      // Harmony Summary
      doc.setFontSize(12);
      doc.setTextColor(200, 200, 200);
      doc.text('Harmony Summary:', margin, yPos);
      yPos += 7;
      doc.setFontSize(10);
      doc.setTextColor(180, 180, 180);
      const summaryLines = doc.splitTextToSize(results.harmonySummary, contentWidth);
      doc.text(summaryLines, margin, yPos);
      yPos += summaryLines.length * 5 + 10;
      
      // Metrics Grid
      doc.setFontSize(14);
      doc.setTextColor(107, 138, 253);
      doc.text('Detailed Metrics', margin, yPos);
      yPos += 10;
      
      const metricsPerPage = 8;
      results.metrics.forEach((metric: any, index: number) => {
        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = margin;
          doc.setFillColor(10, 10, 20);
          doc.rect(0, 0, pageWidth, pageHeight, 'F');
        }
        
        // Metric card
        doc.setFillColor(25, 25, 35);
        doc.roundedRect(margin, yPos, contentWidth, 18, 2, 2, 'F');
        
        // Metric name
        doc.setFontSize(11);
        doc.setTextColor(220, 220, 220);
        doc.text(metric.name, margin + 3, yPos + 6);
        
        // Metric value
        doc.setFontSize(10);
        doc.setTextColor(107, 138, 253);
        doc.text(metric.value, margin + 3, yPos + 12);
        
        // Confidence dot
        const dotX = pageWidth - margin - 5;
        const dotY = yPos + 6;
        const dotColor = metric.confidence === 'high' ? [34, 197, 94] : 
                         metric.confidence === 'medium' ? [234, 179, 8] : [156, 163, 175];
        doc.setFillColor(dotColor[0], dotColor[1], dotColor[2]);
        doc.circle(dotX, dotY, 2, 'F');
        
        // Feedback text
        doc.setFontSize(9);
        doc.setTextColor(160, 160, 160);
        const feedbackLines = doc.splitTextToSize(metric.feedback, contentWidth - 10);
        doc.text(feedbackLines, margin + 3, yPos + 16);
        
        yPos += 22;
      });
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text('Generated by Lynxmax - AI Facial Analysis Tool', pageWidth / 2, pageHeight - 10, { align: 'center' });
      doc.text('All analysis performed locally in your browser', pageWidth / 2, pageHeight - 6, { align: 'center' });
      
      // Save PDF
      doc.save('lynxmax-report.pdf');
      
      toast({ title: "✓ Report downloaded", description: "PDF saved successfully" });
    } catch (error) {
      console.error("Download error:", error);
      toast({ title: "Download failed", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl page-transition">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
          Lynxmax – AI Facial Symmetry & Looksmaxing Tool
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Analyze facial harmony, symmetry, and proportions using advanced AI. 
          All processing happens locally in your browser—your photos never leave your device.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="glass-card p-4 mb-8 border-primary/30">
        <p className="text-sm text-center">
          🔒 <strong>100% Private:</strong> All analysis runs locally in your browser. No images are uploaded or stored.
        </p>
      </div>

      {/* Loading Progress */}
      {loadingStep && (
        <div className="glass-card p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{loadingStep}</span>
            <span className="text-sm text-muted-foreground">{loadingProgress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="space-y-6 mb-8">
        <UploadArea 
          onImageSelect={handleImageSelect} 
          imageUrl={imageUrl}
          onClear={handleClear}
        />

        {imageUrl && (
          <div className="relative glass-card p-4 flex justify-center">
            <div className="relative">
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Analysis target"
                className="max-w-full max-h-96 rounded-lg"
                crossOrigin="anonymous"
              />
              {landmarks && imageRef.current && (
                <CanvasOverlay 
                  imageUrl={imageUrl} 
                  landmarks={landmarks}
                  imageElement={imageRef.current}
                />
              )}
            </div>
          </div>
        )}

        {imageUrl && (
          <>
            <GenderSelector selected={gender} onSelect={setGender} />

            <Button
              className="w-full btn-primary h-12 text-lg"
              onClick={handleAnalyze}
              disabled={analyzing || !gender}
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Face"
              )}
            </Button>
          </>
        )}
      </div>

      {/* Results Section */}
      {results && (
        <div ref={resultsRef} className="space-y-8">
          <QualityPanel 
            roll={results.quality.roll}
            yaw={results.quality.yaw}
            ipd={results.quality.ipd}
            rollThreshold={8}
            yawThreshold={[0.85, 1.15]}
          />

          <ResultsGrid
            metrics={results.metrics}
            overallScore={results.overallScore}
            harmonySummary={results.harmonySummary}
          />

          <div className="flex justify-center">
            <Button variant="outline" className="gap-2" onClick={handleDownloadReport}>
              <Download className="w-4 h-4" />
              Download Report (PDF)
            </Button>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-16 glass-card p-6 border-yellow-500/30">
        <h3 className="font-semibold mb-2">⚠️ Important Disclaimer</h3>
        <p className="text-sm text-muted-foreground">
          This tool provides photo-based approximations using 2D facial landmarks. 
          Some cephalometric metrics are proxy estimates and should not be considered medical advice. 
          Results are for educational and entertainment purposes only. 
          True attractiveness is subjective and multifaceted.
        </p>
      </div>
    </div>
  );
};

export default Home;
