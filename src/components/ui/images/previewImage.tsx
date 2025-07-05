// export const PreviewImage = ({ file, url, label }: { file?: File; url?: string; label: string }) => {
//   const src = file ? URL.createObjectURL(file) : url;
//   return (
//     <div className="text-center">
//       <img
//         src={src}
//         alt={label}
//         className="w-22 h-22 object-contain rounded border border-gray-300 bg-white p-1"
//       />
//       <p className="text-sm mt-1 text-gray-600">{label}</p>
//     </div>
//   );
// };

// import React from "react";

// interface PreviewImageProps {
//   file?: File;
//   url?: string;
//   label: string;
// }

// export const PreviewImage: React.FC<PreviewImageProps> = ({ file, url, label }) => {
//   const src = file ? URL.createObjectURL(file) : url;

//   if (!src) return null;

//   return (
//     <div className="text-center">
//       <img
//         src={src}
//         alt={label}
//         className="w-22 h-22 object-contain rounded border border-gray-300 bg-white p-1"
//       />
//       <p className="text-sm mt-1 text-gray-600">{label}</p>
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";

interface PreviewImageProps {
  file?: File;
  url?: string;
  label: string;
}

export const PreviewImage: React.FC<PreviewImageProps> = ({ file, url, label }) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    if (file instanceof File) {
      try {
        objectUrl = URL.createObjectURL(file);
        setSrc(objectUrl);
      } catch (e) {
        console.error("Invalid file passed to PreviewImage:", e);
      }

      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    }

    if (url) {
      setSrc(url);
    }
  }, [file, url]);

  if (!src) return null;

  return (
    <div className="text-center">
      <img
        src={src}
        alt={label}
        className="w-22 h-22 object-contain rounded border border-gray-300 bg-white p-1"
      />
      <p className="text-sm mt-1 text-gray-600">{label}</p>
    </div>
  );
};