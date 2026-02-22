import { useEffect, useRef } from 'react';

export default function AdBanner() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const script1 = document.createElement('script');
    script1.innerHTML = `atOptions = { 'key' : '87afe0cbb8dd8164f2c3a4a2524323d6', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };`;

    const script2 = document.createElement('script');
    script2.src = 'https://www.highperformanceformat.com/87afe0cbb8dd8164f2c3a4a2524323d6/invoke.js';
    script2.async = true;

    ref.current.appendChild(script1);
    ref.current.appendChild(script2);
  }, []);

  return (
    <div className="flex justify-center my-6">
      <div ref={ref} style={{ width: '320px', height: '50px', overflow: 'hidden' }} />
    </div>
  );
}