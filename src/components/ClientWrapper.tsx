'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';

const hiddenPaths = ['/signin', '/signup', '/forgotpass'];

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const shouldHideHeader = hiddenPaths.includes(pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </>
  );
}
