import { useEffect, useRef, useState } from 'react';

// iOS Safari neumí srcDoc s externími skripty → použijeme data: URL
const mobileHtml = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:0;overflow:hidden;background:transparent;}</style></head><body><script>atOptions={'key':'87afe0cbb8dd8164f2c3a4a2524323d6','format':'iframe','height':50,'width':320,'params':{}};<\/script><script src="https://www.highperformanceformat.com/87afe0cbb8dd8164f2c3a4a2524323d6/invoke.js"><\/script></body></html>`;

const desktopHtml = `<!DOCTYPE html><html><head><style>body{margin:0;padding:0;overflow:hidden;background:transparent;}</style></head><body><script async data-cfasync="false" src="https://pl28764392.effectivegatecpm.com/0a15c12ae0beea74e0cf91c387f1d820/invoke.js"><\/script><div id="container-0a15c12ae0beea74e0cf91c387f1d820"></div></body></html>`;

const mobileSrc = `data:text/html;charset=utf-8,${encodeURIComponent(mobileHtml)}`;
const desktopSrc = `data:text/html;charset=utf-8,${encodeURIComponent(desktopHtml)}`;

export default function AdBanner() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); clearTimeout(timer); } },
      { rootMargin: '300px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, []);

  return (
    <div ref={ref} className="flex justify-center mb-2 mt-0" style={{ minHeight: '50px' }}>
      {visible && (
        <>
          {/* Mobilní reklama */}
          <div className="block sm:hidden">
            <iframe
              src={mobileSrc}
              style={{ width: '320px', height: '50px', border: 'none', overflow: 'hidden', display: 'block' }}
              scrolling="no"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
            />
          </div>

          {/* Desktopová reklama */}
          <div className="hidden sm:block">
            <iframe
              src={desktopSrc}
              style={{ width: '728px', height: '90px', border: 'none', overflow: 'hidden', display: 'block' }}
              scrolling="no"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
            />
          </div>
        </>
      )}
    </div>
  );
}