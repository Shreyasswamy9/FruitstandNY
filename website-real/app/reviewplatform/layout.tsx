import React from 'react';

export const metadata = {
  title: 'Product Review Survey',
};

export default function ReviewPlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
