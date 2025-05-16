import { Inter } from 'next/font/google'
import "./globals.css";
import { Toaster } from "@/components/ui/toast";
import Logger from '@/lib/logger';
import localFont from 'next/font/local';

const inter = Inter({ subsets: ['latin'] })

const geist = localFont({
  src: [
    {
      path: './path-to-your-fonts/Geist-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    // Add other weights/styles as needed
  ],
});

export const metadata = {
  title: "DSWD Social Welfare Capital Fund",
  description:
    "SLP-DSWD-AURORA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}