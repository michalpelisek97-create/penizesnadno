import { useEffect, useRef, useState } from 'react';

export default function AdBanner() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const mobileIframeRef = useRef(null);
  const desktopIframeRef = useRef(null);

  useEffect(() => {
    // Načti reklamy až po interakci uživatele NEBO po 5 sekundách
    // Tím předejdeme okamžitému spuštění video reklam při načtení stránky
    let loaded = false;

    const load = () => {
      if (loaded) return;
      loaded = true;
      setVisible(true);
    };

    // Po interakci uživatele
    const onInteraction = () => load();
    window.addEventListener('scroll', onInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', onInteraction, { once: true, passive: true });
    window.addEventListener('click', onInteraction, { once: true, passive: true });

    // Fallback: načti po 5 sekundách i bez interakce
    const timer = setTimeout(load, 5000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onInteraction);
      window.removeEventListener('touchstart', onInteraction);
      window.removeEventListener('click', onInteraction);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;

    const injectMobile = () => {
      const iframe = mobileIframeRef.current;
      if (!iframe) return;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;
      doc.open();
      doc.write(`<!DOCTYPE html><html><head>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <style>
          body{margin:0;padding:0;overflow:hidden;background:transparent;}
          video{display:none!important;}
          [id*="video"],[class*="video"],[id*="Video"],[class*="Video"]{display:none!important;}
        </style>
      </head><body>
        <script>atOptions={'key':'87afe0cbb8dd8164f2c3a4a2524323d6','format':'iframe','height':50,'width':320,'params':{}};<\/script>
        <script src="https://www.highperformanceformat.com/87afe0cbb8dd8164f2c3a4a2524323d6/invoke.js"><\/script>
      </body></html>`);
      doc.close();
    };

    const injectDesktop = () => {
      const iframe = desktopIframeRef.current;
      if (!iframe) return;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;
      doc.open();
      doc.write(`<!DOCTYPE html><html><head>
        <style>
          body{margin:0;padding:0;overflow:hidden;background:transparent;}
          video{display:none!important;}
          [id*="video"],[class*="video"],[id*="Video"],[class*="Video"]{display:none!important;}
        </style>
      </head><body>
        <script async data-cfasync="false" src="https://pl28764392.effectivegatecpm.com/0a15c12ae0beea74e0cf91c387f1d820/invoke.js"><\/script>
        <div id="container-0a15c12ae0beea74e0cf91c387f1d820"></div>
      </body></html>`);
      doc.close();
    };

    const t = setTimeout(() => {
      injectMobile();
      injectDesktop();
    }, 100);

    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div ref={ref} className="flex justify-center mb-2 mt-0" style={{ minHeight: '50px' }}>
      {visible && (
        <>
          {/* Mobilní reklama */}
          <div className="block sm:hidden">
            <iframe
              ref={mobileIframeRef}
              style={{ width: '320px', height: '50px', border: 'none', overflow: 'hidden', display: 'block' }}
              scrolling="no"
            />
          </div>

          {/* Desktopová reklama */}
          <div className="hidden sm:block">
            <iframe
              ref={desktopIframeRef}
              style={{ width: '728px', height: '90px', border: 'none', overflow: 'hidden', display: 'block' }}
              scrolling="no"
            />
          </div>
        </>
      )}
    </div>
  );
}