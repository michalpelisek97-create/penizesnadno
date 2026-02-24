import { useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';

export default function AdBanner() {
  const mobileIframeRef = useRef(null);
  const desktopIframeRef = useRef(null);
  const mobileTracked = useRef(false);
  const desktopTracked = useRef(false);

  const today = new Date().toISOString().split('T')[0];

  const trackEvent = (event_type, ad_type) => {
    base44.entities.AdEvent.create({ event_type, ad_type, date: today }).catch(() => {});
  };

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
        video,object,embed{display:none!important;}
        [class*="interstitial"],[class*="overlay"],[class*="popup"],[id*="popup"]{display:none!important;}
      </style>
      <script>
        Object.defineProperty(HTMLMediaElement.prototype,'autoplay',{set:function(){},get:function(){return false;}});
        Object.defineProperty(HTMLMediaElement.prototype,'play',{value:function(){return Promise.reject();}});
      <\/script>
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
        video,object,embed{display:none!important;}
        [class*="interstitial"],[class*="overlay"],[class*="popup"],[id*="popup"]{display:none!important;}
      </style>
      <script>
        Object.defineProperty(HTMLMediaElement.prototype,'autoplay',{set:function(){},get:function(){return false;}});
        Object.defineProperty(HTMLMediaElement.prototype,'play',{value:function(){return Promise.reject();}});
      <\/script>
    </head><body>
      <script async data-cfasync="false" src="https://pl28764392.effectivegatecpm.com/0a15c12ae0beea74e0cf91c387f1d820/invoke.js"><\/script>
      <div id="container-0a15c12ae0beea74e0cf91c387f1d820"></div>
    </body></html>`);
    doc.close();
  };

  useEffect(() => {
    injectMobile();
    injectDesktop();

    // Track impressions via IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el === mobileIframeRef.current && !mobileTracked.current) {
          mobileTracked.current = true;
          trackImpression('mobile_banner');
        }
        if (el === desktopIframeRef.current && !desktopTracked.current) {
          desktopTracked.current = true;
          trackImpression('desktop_leaderboard');
        }
      });
    }, { threshold: 0.5 });

    if (mobileIframeRef.current) observer.observe(mobileIframeRef.current);
    if (desktopIframeRef.current) observer.observe(desktopIframeRef.current);

    return () => observer.disconnect();
  }, []);

  const handleClick = (type) => {
    base44.analytics.track({ eventName: 'ad_click', properties: { ad_type: type } });
  };

  return (
    <div className="flex justify-center mb-2 mt-0">
      {/* Mobilní reklama */}
      <div className="block sm:hidden" style={{ width: '320px', height: '50px' }}>
        <iframe
          ref={mobileIframeRef}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation-by-user-activation allow-popups-to-escape-sandbox"
          style={{ width: '320px', height: '50px', border: 'none', display: 'block' }}
          scrolling="no"
          title="Reklama - bonusy a cashback"
          onClick={() => handleClick('mobile_banner')}
        />
      </div>

      {/* Desktopová reklama */}
      <div className="hidden sm:block" style={{ width: '728px', height: '90px' }}>
        <iframe
          ref={desktopIframeRef}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation-by-user-activation allow-popups-to-escape-sandbox"
          style={{ width: '728px', height: '90px', border: 'none', display: 'block' }}
          scrolling="no"
          title="Reklama - bonusy a cashback"
          onClick={() => handleClick('desktop_leaderboard')}
        />
      </div>
    </div>
  );
}