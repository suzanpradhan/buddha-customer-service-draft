import AuthLayout from '@/core/ui/zenbuddha/src/layouts/AuthLayout';
import Link from 'next/link';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayout
      backgroundImage="/images/auth_background.png"
      logo="/logo/logo_white.png"
      footer={
        <div className="text-white text-sm">
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/contact" className="ml-2">
            Contact
          </Link>
        </div>
      }
    >
      {children}
    </AuthLayout>
  );
}
