import Provider from '@/core/redux/provider';
import Notification from '@/core/ui/components/notification';
import localFont from 'next/font/local';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

export const metadata = {
  title: 'BuddhaAir HelpDesk',
  description: 'BuddhaAir Customer Service Portal',
  keywords: ['buddhaair', 'customerservice', 'helpdesk'],
  authors: [
    {
      name: 'Sujan Pradhan',
      url: 'https://github.com/suzanpradhan',
    },
  ],
  creator: 'Sujan Pradhan',
  publisher: 'Sujan Pradhan',
  icons: {
    icon: '/favicon.ico',
  },
};

const helvetica = localFont({
  src: [
    {
      path: '../../public/fonts/HelveticaNowDisplay-Light.ttf',
      weight: '300',
    },
    {
      path: '../../public/fonts/HelveticaNowDisplay-Regular.ttf',
      weight: '400',
    },
    {
      path: '../../public/fonts/HelveticaNowDisplay-Medium.ttf',
      weight: '500',
    },
    {
      path: '../../public/fonts/HelveticaNowDisplay-Bold.ttf',
      weight: '600',
    },
    {
      path: '../../public/fonts/HelveticaNowDisplay-ExtraBold.ttf',
      weight: '700',
    },
    {
      path: '../../public/fonts/HelveticaNowDisplay-Black.ttf',
      weight: '800',
    },
    {
      path: '../../public/fonts/HelveticaNowDisplay-ExtBlk.ttf',
      weight: '900',
    },
  ],
  variable: '--font-helvetica',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${helvetica.variable} font-sans`}>
      <body className="bg-whiteShade">
        <Notification />
        <div id="deleteWarningDialog"></div>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
