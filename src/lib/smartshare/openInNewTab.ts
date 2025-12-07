// // src/lib/smartshare/openInNewTab.ts
// import { copyToClipboard } from './copyToClipboard';
// import { SharePayload } from './buildShareLinks';
// import { buildShareLink } from './buildShareLinks';

// export async function openInNewTab(platform: string, payload: SharePayload) {
//   const url = buildShareLink(platform as any, payload);
//   // copy text if there's text to paste
//   if (payload.text) {
//     await copyToClipboard(payload.text);
//   }
//   // open in new tab
//   window.open(url, '_blank');
// }
