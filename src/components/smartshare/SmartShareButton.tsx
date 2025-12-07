// // src/components/smartshare/SmartShareButton.tsx
// 'use client';

// import { useState } from 'react';
// import SmartShareModal from './SmartShareModal';
// import type { PlatformKey } from '@/lib/smartshare/platforms';

// type PayloadMap = Record<
//   PlatformKey,
//   {
//     text?: string;
//     url?: string;
//     title?: string;
//   }
// >;

// type Props = {
//   // map of platform -> payload. Only keys present will be shown in the modal (you chose B).
//   items: Partial<PayloadMap>;
//   buttonLabel?: string;
// };

// export default function SmartShareButton({ items, buttonLabel = 'Post to socials' }: Props) {
//   const [open, setOpen] = useState(false);
//   const platforms = Object.keys(items) as PlatformKey[];

//   if (!platforms.length) return null;

//   return (
//     <>
//       <button
//         type="button"
//         onClick={() => setOpen(true)}
//         className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-500"
//       >
//         {buttonLabel}
//         <span className="text-xs opacity-80">→</span>
//       </button>

//       <SmartShareModal
//         open={open}
//         onClose={() => setOpen(false)}
//         items={items}
//       />
//     </>
//   );
// }
