import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "./ui/button";

interface UploadAreaProps {
  onImageSelect: (file: File, imageUrl: string) => void;
  imageUrl: string | null;
  onClear: () => void;
}

export const UploadArea = ({ onImageSelect, imageUrl, onClear }: UploadAreaProps) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      onImageSelect(file, url);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  if (imageUrl) {
    return (
      <div className="relative glass-card p-4">
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-6 right-6 z-10 rounded-full"
          onClick={onClear}
        >
          <X className="w-4 h-4" />
        </Button>
        <img
          src={imageUrl}
          alt="Uploaded face"
          className="max-w-full max-h-96 mx-auto rounded-lg"
        />
      </div>
    );
  }

  return (
    <div
      className={`glass-card p-12 border-2 border-dashed transition-all duration-300 cursor-pointer ${
        dragActive ? "border-primary bg-primary/5 scale-105" : "border-border"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="p-4 rounded-full bg-primary/10 neon-glow">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <div>
          <p className="text-lg font-semibold mb-2">Upload Your Photo</p>
          <p className="text-sm text-muted-foreground">
            Click or drag & drop your photo here
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            JPG or PNG • Face forward • Neutral expression • Good lighting
          </p>
        </div>
      </div>
    </div>
  );
};
