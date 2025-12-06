// src/lib/smartshare/openInPopup.ts
import { copyToClipboard } from './copyToClipboard';
import { SharePayload } from './buildShareLinks';
import { buildShareLink } from './buildShareLinks';

export async function openInPopup(platform: string, payload: SharePayload) {
  const url = buildShareLink(platform as any, payload);

  if (payload.text) {
    await copyToClipboard(payload.text);
  }

  const width = 700;
  const height = 700;
  const left = window.screenX + (window.innerWidth - width) / 2;
  const top = window.screenY + (window.innerHeight - height) / 2;

  const popup = window.open(
    url,
    `smartshare_${platform}`,
    `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,status=no`
  );

  // popup blocked fallback to new tab
  if (!popup) {
    window.open(url, '_blank');
  } else {
    popup.focus();
  }
}
