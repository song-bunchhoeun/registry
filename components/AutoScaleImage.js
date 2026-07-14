import { useState, useEffect } from "react";

export default function AutoScaleImage({
  width,
  height,
  maxWidth,
  wrappedDocument,
  qrcode,
}) {
  const [imageUrl, setImageUrl] = useState(null);

  const imageRatio = width / height;
  const [imageSize, setImageSize] = useState([0, 0]);

  useEffect(() => {
    const controller = new AbortController();
    const observer = new ResizeObserver(() => {
      const width = clamp(document.body.clientWidth, 0, maxWidth);
      setImageSize([width, width / imageRatio]);
    });

    observer.observe(document.body);

    (async () => {
      try {
        const response = await fetch("/api/template/render", {
          method: "POST",
          body: JSON.stringify({
            wrappedDocument,
            qrcode,
          }),
          headers: {
            "content-type": "application/json",
          },
          signal: controller.signal,
        });

        const data = await response.blob();
        setImageUrl(URL.createObjectURL(data));
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      observer.disconnect();
      controller.abort();

      if (imageUrl != null) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, []);

  return (
    <>
      <div className="fixed-canvas-wrapper">
        {imageUrl != null ? (
          <img
            src={imageUrl}
            width={imageSize[0]}
            height={imageSize[1]}
            alt=""
          />
        ) : (
          <img
            style={{ opacity: 0 }}
            width={imageSize[0]}
            height={imageSize[1]}
            alt=""
          />
        )}
      </div>
    </>
  );
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
