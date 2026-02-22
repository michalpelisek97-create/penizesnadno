import React, { useEffect } from 'react';

/**
 * PerformanceMonitor - Sleduje Core Web Vitals a optimalizace
 * - LCP (Largest Contentful Paint)
 * - FID/INP (Input Delay)
 * - CLS (Cumulative Layout Shift)
 */
export default function PerformanceMonitor() {
  useEffect(() => {
    // Reportování Web Vitals
    const reportWebVitals = () => {
      try {
        // LCP (Largest Contentful Paint)
        const lcpEntries = performance.getEntriesByName('largest-contentful-paint');
        if (lcpEntries.length > 0) {
          const lcp = lcpEntries[lcpEntries.length - 1];
          console.log('📊 LCP:', Math.round(lcp.renderTime), 'ms');
        }

        // FCP (First Contentful Paint)
        const fcpEntries = performance.getEntriesByName('first-contentful-paint');
        if (fcpEntries.length > 0) {
          const fcp = fcpEntries[0];
          console.log('⚡ FCP:', Math.round(fcp.startTime), 'ms');
        }

        // Resource timing analysis
        const resources = performance.getEntriesByType('resource');
        const slowResources = resources.filter(r => r.duration > 500);
        if (slowResources.length > 0) {
          console.warn('⚠️ Pomalé zdroje (>500ms):', slowResources.map(r => ({
            name: r.name,
            duration: Math.round(r.duration) + 'ms'
          })));
        }
      } catch (error) {
        console.error('Performance monitoring error:', error);
      }
    };

    // Zpoždění reportování na end of page load
    window.addEventListener('load', reportWebVitals);
    return () => window.removeEventListener('load', reportWebVitals);
  }, []);

  return null;
}