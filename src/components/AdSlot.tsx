import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  label?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  slotId,
  format = 'auto',
  className = '',
  label = 'Advertisement',
}) => {
  const adClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || '';
  const adInitializedRef = useRef(false);

  useEffect(() => {
    if (!adClientId || !slotId) return;

    // Load AdSense script once if not already present
    const scriptId = 'adsense-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Push ad slot safely once per mount
    if (!adInitializedRef.current) {
      adInitializedRef.current = true;
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        // Silently handle ad-blocker or script load delays
      }
    }
  }, [adClientId, slotId]);

  // If no AdSense Client ID is configured in the environment, do NOT display empty or placeholder ad containers
  // to maintain Google AdSense policy compliance and prevent Cumulative Layout Shift (CLS).
  if (!adClientId || !slotId) {
    return null;
  }

  return (
    <div
      className={`my-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 text-center ${className}`}
      aria-label="Sponsored advertisement"
    >
      <div className="mb-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase select-none">
        {label}
      </div>
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={adClientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};


