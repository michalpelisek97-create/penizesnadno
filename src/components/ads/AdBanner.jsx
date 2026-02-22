import { useEffect, useRef } from 'react';

export default function AdBanner() {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const html = `<!DOCTYPE html>
<html>
<head><style>body{margin:0;padding:0;overflow:hidden;}</style></head>
<body>
<script>
  atOptions = { 'key' : '87afe0cbb8dd8164f2c3a4a2524323d6', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };
<\/script>
<script src="https://www.highperformanceformat.com/87afe0cbb8dd8164f2c3a4a2524323d6/invoke.js"><\/script>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframe.src = url;

    return () => URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="flex justify-center my-6">
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts allow-same-origin"
        style={{ width: '320px', height: '50px', border: 'none', overflow: 'hidden' }}
        scrolling="no"
      />
    </div>
  );
}