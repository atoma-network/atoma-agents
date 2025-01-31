import './globals.css';
import { Manrope } from 'next/font/google';
import Header from './components/ui/Header';
import Providers from '@/app/providers';
import '@suiet/wallet-kit/style.css';
import './walletCustomCss.css';
import Sidebar from './components/ui/Sidebar';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata = {
  title: 'AtomaSage',
  description: 'AtomaSage is a simple ai agent that allows you to interact with the LLM model.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`h-[100%] ${manrope.className} bg-gray-100`}>
        <Providers>
          <Sidebar>
            <div className="m-4">
              <Header />
              <div>{children}</div>
            </div>
          </Sidebar>
        </Providers>
      </body>
    </html>
  );
}
