import { useState } from "react";
import { Hand } from "lucide-react";

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = "w-full h-full object-cover",
  fallbackTitle = "SignBridge 3D Illustration",
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F0E9FF] via-[#E8DCFF] to-[#D8C4FF]/60 p-8 text-center ${className}`}
      >
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9061D8] to-[#7041B5] text-white shadow-md">
          <Hand className="h-7 w-7" aria-hidden="true" />
        </div>
        <p className="font-medium text-[#38205F]">{fallbackTitle}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
