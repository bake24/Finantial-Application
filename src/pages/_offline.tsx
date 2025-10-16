/**
 * Офлайн-страница для PWA
 */

import Head from 'next/head';
import { OfflineFallback } from '@/widgets/OfflineFallback';

export default function OfflinePage() {
  return (
    <>
      <Head>
        <title>Нет подключения | Bitcoin Loan App</title>
      </Head>
      <OfflineFallback />
    </>
  );
}

