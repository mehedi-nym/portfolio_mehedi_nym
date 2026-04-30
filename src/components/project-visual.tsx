import { useState } from "react";
import { cn } from "@/lib/utils";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

type Props = {
  label: string;
  images?: string[];
  featured?: boolean;
};

export function ProjectVisual({ label, images = [], featured = false }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openGallery = (index: number) => setSelectedIndex(index);
  const closeGallery = () => setSelectedIndex(null);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 0) {
      setSelectedIndex((prev) => (prev !== null ? (prev + 1) % images.length : 0));
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 0) {
      setSelectedIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : 0));
    }
  };

  // Logic for the "+ more" indicator
  const displayImages = images.slice(0, 9);
  const remainingCount = images.length - 9;

  return (
    <>
      <div
        className={cn(
          "group relative overflow-hidden rounded-[1.75rem] border border-white/20 text-white transition-all duration-500 hover:scale-[1.02]",
          featured ? "min-h-[260px]" : "min-h-[220px]"
        )}
      >
        {/* BACKGROUND GRADIENT */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0f172a,#0f766e_50%,#f97316)]" />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/30 opacity-80 group-hover:opacity-60 transition duration-500" />

        {/* CONTENT */}
        <div className="relative flex h-full flex-col justify-between p-6">
          {images.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {displayImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => openGallery(i)}
                  className="group/thumb relative cursor-pointer overflow-hidden rounded-xl border border-white/20 bg-white/5 backdrop-blur-md transition-all hover:border-white/50"
                >
                  <img
                    src={img}
                    alt={`preview-${i}`}
                    className="h-20 w-full object-cover transition-transform duration-500 group-hover/thumb:scale-110"
                  />
                  
                  {/* HOVER OVERLAY WITH ICON */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover/thumb:opacity-100">
                    {/* If it's the last slot and there are more images, show the count instead of the icon */}
                    {i === 8 && remainingCount > 0 ? (
                      <span className="text-sm font-bold text-white">+{remainingCount}</span>
                    ) : (
                      <Maximize2 className="h-5 w-5 text-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 opacity-70">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="rounded-xl border border-white/15 bg-white/10 p-3">
                  <div className="h-2 w-10 rounded-full bg-white/70" />
                  <div className="mt-3 h-10 rounded-lg bg-white/10" />
                </div>
              ))}
            </div>
          )}

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">System preview</p>
            <p className="mt-2 text-xl font-semibold leading-tight sm:text-2xl">{label}</p>
          </div>
        </div>
      </div>

      {/* FULLSCREEN GALLERY POPUP */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          onClick={closeGallery}
        >
          {/* Close Button */}
          <button 
            className="absolute right-6 top-6 z-[110] text-white/70 hover:text-white transition-colors"
            onClick={closeGallery}
          >
            <X size={32} />
          </button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button 
                className="absolute left-4 top-1/2 z-[110] -translate-y-1/2 p-3 bg-black/5 hover:bg-black/10 border border-white/10 rounded-full text-white transition-all backdrop-blur-md"
                onClick={prevImage}
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                className="absolute right-4 top-1/2 z-[110] -translate-y-1/2 p-3 bg-black/5 hover:bg-black/10 border border-white/10 rounded-full text-white transition-all backdrop-blur-md"
                onClick={nextImage}
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Large Image Container */}
          <div className="max-w-6xl w-full h-full flex flex-col items-center justify-center gap-6">
            <img
              src={images[selectedIndex]}
              alt="full-screen-preview"
              className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
              onClick={(e) => e.stopPropagation()} 
            />
            
            {/* Gallery Indicator/Thumbnails */}
            <div className="flex items-center gap-3">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(idx);
                  }}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    idx === selectedIndex ? "w-8 bg-teal-400" : "w-2 bg-white/20 hover:bg-white/40"
                  )}
                />
              ))}
            </div>
            <p className="text-white/60 text-sm font-medium tracking-wide uppercase">{label}</p>
          </div>
        </div>
      )}
    </>
  );
}