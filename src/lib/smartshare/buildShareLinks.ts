// src/lib/smartshare/buildShareLink.ts
import { PlatformKey } from './platforms';

export type SharePayload = {
  text?: string; // caption/content
  url?: string; // an optional landing URL (recommended for LinkedIn & FB preview)
  title?: string; // for reddit
};

export function buildShareLink(platform: PlatformKey, payload: SharePayload) {
  const { text = '', url = '', title = '' } = payload;

  switch (platform) {
    case 'linkedin':
      // LinkedIn share-offsite requires a URL; use provided url or fall back to current site.
      // For best UX create a share-landing page on your site with og:title/og:description/og:image.
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url || window.location.href
      )}`;

    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text || url || '')}`;

    case 'reddit': {
      // reddit supports title + url or text posts (text must be submitted on the site). We open /submit.
      // We'll prefer a link share if url exists, otherwise open submit page for manual paste.
      if (url) {
        return `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(
          title || text?.slice(0, 100) || 'Shared via ToneMatch'
        )}`;
      }
      // No url -> open submit page
      return `https://www.reddit.com/submit`;
    }

    case 'facebook':
      // Facebook share dialog prefers a URL; text captions are added by the user.
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url || window.location.href)}`;

    case 'medium':
      // Medium does not support prefilled content via a share URL; open new-story editor.
      return `https://medium.com/new-story`;

    default:
      return '';
  }
}
