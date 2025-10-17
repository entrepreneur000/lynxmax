import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const RouteTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsTransitioning(true);
    setProgress(0);

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 50);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
      clearInterval(interval);
    }, 300);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [location.pathname]);

  return (
    <>
      {/* Progress bar */}
      {isTransitioning && (
        <div 
          className="fixed top-0 left-0 h-1 bg-primary transition-all duration-300 z-50"
          style={{ width: `${progress}%` }}
        />
      )}
      
      {/* Content with fade transition */}
      <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </>
  );
};
