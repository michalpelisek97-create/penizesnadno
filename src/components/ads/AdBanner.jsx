export default function AdBanner() {
  const mobileHtml = `<!DOCTYPE html>
<html>
<head><style>body{margin:0;padding:0;overflow:hidden;background:transparent;}</style></head>
<body>
<script>atOptions = { 'key' : '87afe0cbb8dd8164f2c3a4a2524323d6', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };<\/script>
<script src="https://www.highperformanceformat.com/87afe0cbb8dd8164f2c3a4a2524323d6/invoke.js"><\/script>
</body>
</html>`;

  const desktopHtml = `<!DOCTYPE html>
<html>
<head><style>body{margin:0;padding:0;overflow:hidden;background:transparent;}</style></head>
<body>
<script async data-cfasync="false" src="https://pl28764392.effectivegatecpm.com/0a15c12ae0beea74e0cf91c387f1d820/invoke.js"><\/script>
<div id="container-0a15c12ae0beea74e0cf91c387f1d820"></div>
</body>
</html>`;

  return (
    <div className="flex justify-center my-6">
      <div className="rounded-xl overflow-hidden ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/20 bg-black/30 backdrop-blur-sm p-1">
        <div className="text-[10px] text-amber-400/60 text-center mb-1 uppercase tracking-widest font-semibold">Reklama</div>

        {/* Mobilní reklama */}
        <div className="block sm:hidden">
          <iframe
            srcDoc={mobileHtml}
            sandbox="allow-scripts allow-same-origin allow-popups"
            style={{ width: '320px', height: '50px', border: 'none', overflow: 'hidden', display: 'block' }}
            scrolling="no"
          />
        </div>

        {/* Desktopová reklama */}
        <div className="hidden sm:block">
          <iframe
            srcDoc={desktopHtml}
            sandbox="allow-scripts allow-same-origin allow-popups"
            style={{ width: '728px', height: '90px', border: 'none', overflow: 'hidden', display: 'block' }}
            scrolling="no"
          />
        </div>
      </div>
    </div>
  );
}