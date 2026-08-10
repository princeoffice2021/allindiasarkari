import React from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  label?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  slotId = '1234567890',
  format = 'auto',
  className = '',
  label = 'Advertisement',
}) => {
  const adClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || '';

  return (
    <div className={`my-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-2 text-center ${className}`}>
      <div className="mb-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
        {label}
      </div>
      {adClientId ? (
        <ins
          className="adsbygoogle block"
          style={{ display: 'block' }}
          data-ad-client={adClientId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex h-20 items-center justify-center rounded border border-dashed border-slate-300 bg-white p-3 text-xs text-slate-500 shadow-2xs">
          <div className="space-y-1">
            <p className="font-semibold text-slate-700">Google AdSense Space</p>
            <p className="text-[11px] text-slate-400">Add VITE_ADSENSE_CLIENT_ID in env to activate live ads</p>
          </div>
        </div>
      )}
    </div>
  );
};
