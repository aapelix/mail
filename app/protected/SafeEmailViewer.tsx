'use client';

import DOMPurify from 'dompurify';
import { useMemo } from 'react';

type Props = { encodedHtml: string }

export default function SafeEmailViewer({ encodedHtml }: Props) {
  const decoded = useMemo(() => {
    const utf8DecodeBase64 = (base64: string) => {
      const binary = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
      const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    };

    const rawHtml = utf8DecodeBase64(encodedHtml);
    return DOMPurify.sanitize(rawHtml);
  }, [encodedHtml]);

  return (
    <div
      className="prose prose-neutral max-w-none p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-md"
      dangerouslySetInnerHTML={{ __html: decoded }}
    />
  );
}
