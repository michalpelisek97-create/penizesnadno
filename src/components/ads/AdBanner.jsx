import { useEffect, useRef } from 'react';

function MobileAd() {
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
    <iframe
      ref={iframeRef}
      sandbox="allow-scripts allow-same-origin"
      style={{ width: '320px', height: '50px', border: 'none', overflow: 'hidden' }}
      scrolling="no"
    />
  );
}

function DesktopAd() {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const html = `<!DOCTYPE html>
<html>
<head><style>body{margin:0;padding:0;overflow:hidden;}</style></head>
<body>
<script async data-cfasync="false" src="https://pl28764392.effectivegatecpm.com/0a15c12ae0beea74e0cf91c387f1d820/invoke.js"><\/script>
<div id="container-0a15c12ae0beea74e0cf91c387f1d820"></div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframe.src = url;

    return () => URL.revokeObjectURL(url);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      style={{ width: '728px', height: '90px', border: 'none', overflow: 'hidden' }}
      scrolling="no"
    />
  );
}

export default function AdBanner() {
  return (
    <div className="flex justify-center my-6">
      {/* Mobilní reklama - zobrazí se jen na malých obrazovkách */}
      <div className="block sm:hidden">
        <MobileAd />
      </div>
      {/* Desktopová reklama - zobrazí se jen na velkých obrazovkách */}
      <div className="hidden sm:block">
        <DesktopAd />
      </div>
    </div>
  );
}