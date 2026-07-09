import dynamic from 'next/dynamic';

const SpaPage = dynamic(() => import('./SpaPage'), { ssr: false });

export default function Page() {
  return <SpaPage />;
}
