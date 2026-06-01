'use client';

import { useEffect } from 'react';

export default function RedirectClient({ url }: { url: string }) {
  useEffect(() => {
    // Perform redirection immediately on the client side
    window.location.href = url;
  }, [url]);

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', paddingTop: '100px' }}>
      <p style={{ fontSize: '18px', fontWeight: 'bold' }}>กำลังนำคุณไปยังร้านค้า...</p>
      <p style={{ fontSize: '14px', color: '#888' }}>
        หากหน้าเว็บไม่เปลี่ยนเส้นทางโดยอัตโนมัติ{' '}
        <a href={url} style={{ color: '#ff6b35', textDecoration: 'underline' }}>
          คลิกที่นี่เพื่อไปต่อ
        </a>
      </p>
    </div>
  );
}
