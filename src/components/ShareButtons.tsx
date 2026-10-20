import React, { useState } from 'react';
import {
  FaWhatsapp,
  FaTelegram,
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaPinterestP,
  FaRedditAlien,
  FaThreads,
  FaTumblr,
  FaSnapchat,
  FaFacebookMessenger,
  FaInstagram,
  FaEnvelope,
  FaShareNodes,
  FaLink,
  FaCheck,
} from 'react-icons/fa6';
import { Share2, CheckCircle2 } from 'lucide-react';

interface IconProps {
  icon: React.ComponentType<{ size?: string | number }>;
  size?: number;
  className?: string;
}

const BrandIcon: React.FC<IconProps> = ({ icon: Component, size = 16, className = 'shrink-0 flex items-center justify-center' }) => (
  <span className={className}>
    <Component size={size} />
  </span>
);

const ShareChatIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = 'shrink-0' }) => (
  <span className={className} style={{ width: size, height: size, display: 'inline-flex' }}>
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="m23.843 24.181l7.212-7.21M29.515 5.07l-5.579 5.579m-12.999.628l19.552 19.55l-6.827 6.827m-6.54-31.621c2.826 1.59 7.902 4.91 13.932 10.936m-25.373.468c1.587 2.825 4.912 7.92 10.966 13.974c6.01 6.01 11.074 9.33 13.91 10.93M10.939 11.277C7.614 14.747 3.371 19.205 3.518 24c-.148 4.795 4.096 9.253 7.418 12.723c4.266 4.266 8.224 6.978 11.696 7.605c5.319 1.136 10.305-3.608 14.108-7.25c3.827-3.826 6.405-7.405 7.347-10.609l.001-.004c.28-.781.407-1.6.395-2.45a7 7 0 0 0-.395-2.48v-.004c-.943-3.204-3.52-6.783-7.348-10.61c-3.802-3.64-8.788-8.383-14.105-7.25c-3.474.627-7.432 3.34-11.699 7.605z" />
    </svg>
  </span>
);

interface ShareButtonsProps {
  title: string;
  url?: string;
  className?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  title,
  url,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const getCanonicalUrl = (): string => {
    if (url) return url;
    if (typeof window !== 'undefined') {
      const canonicalTag = document.querySelector('link[rel="canonical"]');
      if (canonicalTag && canonicalTag.getAttribute('href')) {
        return canonicalTag.getAttribute('href')!;
      }
      return window.location.href;
    }
    return 'https://allindiasarkari.com';
  };

  const shareUrl = getCanonicalUrl();
  const encodedUrl = encodeURIComponent(shareUrl);
  const fullTitle = `${title} | All India Sarkari`;
  const encodedTitle = encodeURIComponent(fullTitle);

  const triggerFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      triggerFeedback('Article link copied to clipboard! Ready to paste & share.');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      triggerFeedback('Failed to copy automatically. Please copy the URL from your address bar.');
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: fullTitle,
          text: `Check this update on All India Sarkari: ${title}`,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error)?.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleShareChat = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: fullTitle,
          text: `${title} - All India Sarkari: ${shareUrl}`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }
    handleCopyLink();
    triggerFeedback('Article link copied! You can now paste and share it on ShareChat.');
  };

  const handleInstagram = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: fullTitle,
          text: `${title} - All India Sarkari: ${shareUrl}`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }
    handleCopyLink();
    triggerFeedback('Article link copied! You can now paste it into your Instagram Story or direct message.');
  };

  return (
    <section
      aria-label="Share Post"
      className={`rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 md:p-6 shadow-2xs space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-900 border border-blue-100">
            <Share2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black uppercase tracking-wide text-slate-900">
              Share This Post
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              Help friends, classmates & study groups stay updated
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyLink}
          type="button"
          className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs font-bold text-blue-900 hover:text-blue-950 bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1 rounded-lg transition-colors border border-blue-200/60"
        >
          {copied ? (
            <>
              <BrandIcon icon={FaCheck} size={14} className="text-emerald-600" />
              <span className="text-emerald-700 font-bold">Link Copied!</span>
            </>
          ) : (
            <>
              <BrandIcon icon={FaLink} size={14} className="text-blue-900" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>

      {/* Dynamic Feedback Banner */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs font-semibold text-emerald-900 animate-fadeIn"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Sharing Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
        {/* 1. WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%0A%0A${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          title="Share on WhatsApp"
          className="flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white px-3 py-2 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98"
        >
          <BrandIcon icon={FaWhatsapp} size={16} />
          <span className="truncate">WhatsApp</span>
        </a>

        {/* 2. Telegram */}
        <a
          href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Telegram"
          title="Share on Telegram"
          className="flex items-center gap-2 rounded-xl bg-[#229ED9] hover:bg-[#1b8ec5] text-white px-3 py-2 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98"
        >
          <BrandIcon icon={FaTelegram} size={16} />
          <span className="truncate">Telegram</span>
        </a>

        {/* 3. Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          title="Share on Facebook"
          className="flex items-center gap-2 rounded-xl bg-[#1877F2] hover:bg-[#0d6efd] text-white px-3 py-2 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98"
        >
          <BrandIcon icon={FaFacebookF} size={16} />
          <span className="truncate">Facebook</span>
        </a>

        {/* 4. X (Twitter) */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X (Twitter)"
          title="Share on X (Twitter)"
          className="flex items-center gap-2 rounded-xl bg-black hover:bg-neutral-800 text-white px-3 py-2 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98"
        >
          <BrandIcon icon={FaXTwitter} size={16} />
          <span className="truncate">X (Twitter)</span>
        </a>

        {/* 5. LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          title="Share on LinkedIn"
          className="flex items-center gap-2 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white px-3 py-2 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98"
        >
          <BrandIcon icon={FaLinkedinIn} size={16} />
          <span className="truncate">LinkedIn</span>
        </a>

        {/* 6. Threads */}
        <a
          href={`https://www.threads.net/intent/post?text=${encodeURIComponent(`${title} ${shareUrl}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Threads"
          title="Share on Threads"
          className="flex items-center gap-2 rounded-xl bg-black hover:bg-neutral-800 text-white px-3 py-2 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98"
        >
          <BrandIcon icon={FaThreads} size={16} />
          <span className="truncate">Threads</span>
        </a>

        {/* 7. Pinterest */}
        <a
          href={`https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pin on Pinterest"
          title="Pin on Pinterest"
          className="flex items-center gap-2 rounded-xl bg-[#E60023] hover:bg-[#b8001c] text-white px-3 py-2 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98"
        >
          <BrandIcon icon={FaPinterestP} size={16} />
          <span className="truncate">Pinterest</span>
        </a>

        {/* 8. Reddit */}
        <a
          href={`https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Reddit"
          title="Share on Reddit"
          className="flex items-center gap-2 rounded-xl bg-[#FF4500] hover:bg-[#e03d00] text-white px-3 py-2 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98"
        >
          <BrandIcon icon={FaRedditAlien} size={16} />
          <span className="truncate">Reddit</span>
        </a>

        {/* 9. ShareChat */}
        <button
          type="button"
          onClick={handleShareChat}
          aria-label="Share on ShareChat"
          title="Share on ShareChat"
          className="flex items-center gap-2 rounded-xl bg-[#3F51B5] hover:bg-[#303F9F] text-white px-3 py-2 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98 text-left"
        >
          <ShareChatIcon size={16} />
          <span className="truncate">ShareChat</span>
        </button>

        {/* 10. Snapchat */}
        <a
          href={`https://www.snapchat.com/share?link=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Snapchat"
          title="Share on Snapchat"
          className="flex items-center gap-2 rounded-xl bg-[#FFFC00] hover:bg-[#eae700] text-slate-900 border border-amber-300 px-3 py-2 text-xs font-extrabold transition-all shadow-2xs hover:shadow-xs active:scale-98"
        >
          <BrandIcon icon={FaSnapchat} size={16} className="text-slate-950 shrink-0 flex items-center justify-center" />
          <span className="truncate">Snapchat</span>
        </a>

        {/* 11. Messenger */}
        <a
          href={`https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=291494419107518&redirect_uri=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Messenger"
          title="Share on Messenger"
          className="flex items-center gap-2 rounded-xl bg-[#0084FF] hover:bg-[#0070db] text-white px-3 py-2 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98"
        >
          <BrandIcon icon={FaFacebookMessenger} size={16} />
          <span className="truncate">Messenger</span>
        </a>

        {/* 12. Instagram */}
        <button
          type="button"
          onClick={handleInstagram}
          aria-label="Share on Instagram"
          title="Share on Instagram (copy link for Story/Direct)"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#FCB045] hover:opacity-90 text-white px-3 py-2 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98 text-left"
        >
          <BrandIcon icon={FaInstagram} size={16} />
          <span className="truncate">Instagram</span>
        </button>

        {/* 13. Tumblr */}
        <a
          href={`https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodedUrl}&title=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Tumblr"
          title="Share on Tumblr"
          className="flex items-center gap-2 rounded-xl bg-[#36465D] hover:bg-[#283445] text-white px-3 py-2 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98"
        >
          <BrandIcon icon={FaTumblr} size={16} />
          <span className="truncate">Tumblr</span>
        </a>

        {/* 14. Email */}
        <a
          href={`mailto:?subject=${encodedTitle}&body=${encodeURIComponent(
            `Check out this government recruitment & scheme update on All India Sarkari:\n\n${title}\n\nRead more here:\n${shareUrl}`
          )}`}
          aria-label="Share via Email"
          title="Share via Email"
          className="flex items-center gap-2 rounded-xl bg-slate-700 hover:bg-slate-800 text-white px-3 py-2 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98"
        >
          <BrandIcon icon={FaEnvelope} size={16} />
          <span className="truncate">Email</span>
        </a>

        {/* 15. Native Device Share */}
        <button
          type="button"
          onClick={handleNativeShare}
          aria-label="Open device share options"
          title="More share options (Web Share)"
          className="flex items-center gap-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white px-3 py-2 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98 text-left"
        >
          <BrandIcon icon={FaShareNodes} size={16} className="text-amber-300 shrink-0 flex items-center justify-center" />
          <span className="truncate">More Options</span>
        </button>

        {/* 16. Copy Link */}
        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Copy link to clipboard"
          title="Copy link to clipboard"
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98 text-left ${
            copied
              ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
              : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
          }`}
        >
          {copied ? (
            <BrandIcon icon={FaCheck} size={16} className="text-emerald-600 shrink-0 flex items-center justify-center" />
          ) : (
            <BrandIcon icon={FaLink} size={16} className="text-slate-600 shrink-0 flex items-center justify-center" />
          )}
          <span className="truncate">{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    </section>
  );
};
