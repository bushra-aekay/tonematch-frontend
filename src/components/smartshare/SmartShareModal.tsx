// // src/components/smartshare/SmartShareModal.tsx
// 'use client';

// import { Fragment, useEffect, useRef, useState } from 'react';
// import { createPortal } from 'react-dom';
// import { PLATFORM_META } from '@/lib/smartshare/platforms';
// import { buildShareLink } from '@/lib/smartshare/buildShareLinks';
// import { openInPopup } from '@/lib/smartshare/openInPopup';
// import { openInNewTab } from '@/lib/smartshare/openInNewTab';
// import { copyToClipboard } from '@/lib/smartshare/copyToClipboard';

// type PlatformKey = keyof typeof PLATFORM_META;

// type Payload = {
//   text?: string;
//   url?: string;
//   title?: string;
// };

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   items: Partial<Record<PlatformKey, Payload>>;
// };

// function ModalShell({ children, onClose }: { children: any; onClose: () => void }) {
//   // portal to body
//   return createPortal(
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <div
//         className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//         aria-hidden
//       />
//       <div
//         className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6 z-10"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {children}
//       </div>
//     </div>,
//     document.body
//   );
// }

// export default function SmartShareModal({ open, onClose, items }: Props) {
//   const platforms = Object.keys(items) as PlatformKey[];

//   useEffect(() => {
//     function onKey(e: KeyboardEvent) {
//       if (e.key === 'Escape') onClose();
//     }
//     if (open) window.addEventListener('keydown', onKey);
//     return () => window.removeEventListener('keydown', onKey);
//   }, [open, onClose]);

//   if (!open) return null;

//   return (
//     <ModalShell onClose={onClose}>
//       <div className="flex items-start justify-between gap-4">
//         <div className="flex-1">
//           <h3 className="text-xl font-semibold">Post to socials</h3>
//           <p className="text-sm text-gray-500 mt-1">Select platforms and choose how you want to open the composer.</p>

//           <div className="mt-4 grid grid-cols-2 gap-3">
//             {platforms.map((key) => {
//               const meta = PLATFORM_META[key as any];
//               const payload = items[key] || {};
//               const shareUrl = buildShareLink(key as any, payload);

//               return (
//                 <div key={key} className="border rounded-lg p-3 flex flex-col">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-lg">{meta.iconEmoji}</div>
//                       <div>
//                         <div className="font-medium">{meta.label}</div>
//                         <div className="text-xs text-gray-500">{payload.title ?? (payload.text ? payload.text.slice(0, 80) + (payload.text.length > 80 ? '…' : '') : 'No preview')}</div>
//                       </div>
//                     </div>
//                     <div className="text-xs text-gray-400">Preview</div>
//                   </div>

//                   <div className="mt-3 flex gap-2">
//                     <button
//                       onClick={async () => {
//                         await copyToClipboard(payload.text || '');
//                         openInPopup(key, payload);
//                       }}
//                       className="flex-1 py-2 rounded-md border hover:bg-gray-50"
//                     >
//                       Open popup
//                     </button>

//                     <button
//                       onClick={async () => {
//                         await copyToClipboard(payload.text || '');
//                         openInNewTab(key, payload);
//                       }}
//                       className="py-2 px-3 rounded-md bg-indigo-600 text-white"
//                     >
//                       Open tab
//                     </button>
//                   </div>

//                   <div className="mt-3">
//                     <div className="text-xs text-gray-500">Composer URL</div>
//                     <div className="mt-1 text-xs text-ellipsis overflow-hidden">{shareUrl}</div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="w-80">
//           <div className="text-sm text-gray-600 mb-2">Quick tips</div>
//           <ul className="text-sm text-gray-700 space-y-2">
//             <li>Content is copied to your clipboard automatically; paste it into the composer if needed.</li>
//             <li>For LinkedIn, use a public URL for image preview (recommended).</li>
//             <li>Desktop popup may be blocked by some browsers — use "Open tab" if that happens.</li>
//           </ul>

//           <div className="mt-6">
//             <button onClick={onClose} className="w-full py-2 rounded-md border">Close</button>
//           </div>
//         </div>
//       </div>
//     </ModalShell>
//   );
// }
