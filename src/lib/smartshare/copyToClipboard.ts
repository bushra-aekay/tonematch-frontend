// // src/lib/smartshare/copyToClipboard.ts
// export async function copyToClipboard(text: string) {
//   try {
//     if (!text) return { ok: false, reason: 'empty' };
//     await navigator.clipboard.writeText(text);
//     return { ok: true };
//   } catch (err) {
//     return { ok: false, reason: 'blocked' };
//   }
// }
