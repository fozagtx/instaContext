interface RetroWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export function RetroWindow({ title, children, className = "", onClose }: RetroWindowProps) {
  return (
    <div className={`border-4 border-neon-cyan shadow-neon-strong bg-black ${className}`}>
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-neon-cyan to-neon-magenta p-2 flex items-center justify-between">
        <span className="font-retro text-xs text-black truncate">{title}</span>
        <div className="flex gap-1 flex-shrink-0">
          {/* Minimize Button */}
          <button 
            className="w-4 h-4 bg-black border border-black hover:bg-gray-800 transition-colors"
            aria-label="Minimize"
          >
            <span className="text-[8px] text-neon-cyan">_</span>
          </button>
          {/* Maximize Button */}
          <button 
            className="w-4 h-4 bg-black border border-black hover:bg-gray-800 transition-colors"
            aria-label="Maximize"
          >
            <span className="text-[8px] text-neon-cyan">□</span>
          </button>
          {/* Close Button */}
          <button 
            className="w-4 h-4 bg-black border border-black hover:bg-red-600 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="text-[8px] text-neon-cyan">×</span>
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
