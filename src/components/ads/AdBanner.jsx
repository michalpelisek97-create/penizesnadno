import { useEffect, useRef } from 'react';

export default function AdBanner() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const script1 = document.createElement('script');
    script1.innerHTML = `atOptions = { 'key' : '8d435fcf615b84048a82837131497a64', 'format' : 'iframe', 'height' : 300, 'width' : 160, 'params' : {} };`;

    const script2 = document.createElement('script');
    script2.src = 'https://www.highperformanceformat.com/8d435fcf615b84048a82837131497a64/invoke.js';
    script2.async = true;

    ref.current.appendChild(script1);
    ref.current.appendChild(script2);
  }, []);

  return (
    <div className="flex justify-center my-6">
      <div ref={ref} style={{ width: '160px', height: '300px', overflow: 'hidden' }} />
    </div>
  );
}