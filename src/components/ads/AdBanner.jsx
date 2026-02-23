import { useEffect, useRef, useState } from 'react';

function MobileAd() {
  const containerRef = useRef(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    const s1 = document.createElement('script');
    s1.text = "atOptions = { 'key' : '87afe0cbb8dd8164f2c3a4a2524323d6', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };";
    containerRef.current.appendChild(s1);

    const s2 = document.createElement('script');
    s2.src = 'https://www.highperformanceformat.com/87afe0cbb8dd8164f2c3a4a2524323d6/invoke.js';
    s2.async = true;
    containerRef.current.appendChild(s2);
  }, []);

  return <div ref={containerRef} style={{ minWidth: '320px', minHeight: '50px' }} />;
}

function DesktopAd() {
  const containerRef = useRef(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    const s = document.createElement('script');
    s.src = 'https://pl28764392.effectivegatecpm.com/0a15c12ae0beea74e0cf91c387f1d820/invoke.js';
    s.async = true;
    s.setAttribute('data-cfasync', 'false');
    containerRef.current.appendChild(s);
  }, []);

  return (
    <div ref={containerRef} style={{ minWidth: '728px', minHeight: '90px' }}>
      <div id="container-0a15c12ae0beea74e0cf91c387f1d820" />
    </div>
  );
}

export default function AdBanner() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
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
          <div className="block sm:hidden"><MobileAd /></div>
          <div className="hidden sm:block"><DesktopAd /></div>
        </>
      )}
    </div>
  );
}