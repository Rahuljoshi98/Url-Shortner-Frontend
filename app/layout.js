import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import ToastContainer from '@/components/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SnapLink – Fast, Smart URL Shortener',
  description: 'Shorten your URLs instantly. Track clicks, manage links, and share smarter with SnapLink.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <ToastContainer />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
