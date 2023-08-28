'use client';
/* eslint-disable @next/next/no-img-element */

import { AppBar, Button } from '@/core/ui/zenbuddha/src';
import { ArrowRight2, Login, Menu } from 'iconsax-react';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session?.user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    checkSession();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-white">
      <AppBar
        hasSideBar={false}
        leading={
          <Link href="/">
            <img
              src="/logo/logo_white.png"
              alt="buddha_air_logo_white"
              className="object-contain w-[150px]"
            />
          </Link>
        }
      >
        {isLoggedIn ? (
          <Button
            type="link"
            href="/admin/dashboard"
            text="Dashboard"
            className="h-9"
            kind="default"
            prefix={
              <Menu className="text-white mr-1" variant="Bold" size={20} />
            }
          />
        ) : (
          <Button
            type="link"
            href="/login"
            text="Login"
            className="h-9"
            kind="default"
            prefix={<Login className="text-white mr-1" size={20} />}
          />
        )}
      </AppBar>
      <div className="font-bold text-xl flex min-h-[calc(100vh-6.5rem)] flex-1 flex-col justify-start items-center relative">
        <div className="absolute top-0 w-full h-[80vh] from-accentBlue-500 via-accentBlue-500/60 to-accentBlue-500/0 bg-gradient-to-b"></div>
        <div className="h-full mt-36 w-full top-0 flex flex-col items-center justify-center z-10">
          <div className="flex flex-col items-center max-w-xl mx-4">
            <h1 className="font-bold text-white text-center">
              Need Assistance? Raise a Ticket and We&apos;ll Be Right on It!
            </h1>
            <p className="text-sm font-normal text-whiteShade text-center mt-2">
              Got any questions, concerns, or special requests? Our awesome team
              of aviation enthusiasts is ready to assist you with a smile.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 w-full max-w-5xl gap-4 mt-24 px-4">
            <Link
              href="/baggage-report"
              className="w-full from-white/60 to-white/25 bg-gradient-to-br h-40 rounded-xl p-4 flex items-center text-white hover:border-2 hover:border-white duration-75 cursor-pointer"
            >
              <div className="flex-1 flex flex-col justify-start h-full">
                <h1 className="text-base font-bold text-accentBlue-900">
                  Baggage Report
                </h1>
                <div className="text-sm font-normal text-accentBlue-900/80 mt-2 line-clamp-6 text-ellipsis">
                  Complete this form to offer feedback, recognize an employee,
                  make a baggage claim or file a complaint regarding your travel
                  experience.
                </div>
              </div>
              <div>
                <ArrowRight2 className="text-accentBlue-500" />
              </div>
            </Link>
            <Link
              href="/lostandfound-report"
              className="w-full from-white/60 to-white/25 bg-gradient-to-br h-40 rounded-xl p-4 flex items-center text-white hover:border-2 hover:border-white duration-75 cursor-pointer"
            >
              <div className="flex-1 flex flex-col justify-start h-full">
                <h1 className="text-base font-bold text-accentBlue-900">
                  Lost and Found
                </h1>
                <div className="text-sm font-normal text-accentBlue-900/80 mt-2 line-clamp-6 text-ellipsis">
                  Complete this form to offer feedback, recognize an employee,
                  make a baggage claim or file a complaint regarding your travel
                  experience.
                </div>
              </div>
              <div>
                <ArrowRight2 className="text-accentBlue-500" />
              </div>
            </Link>
            <Link
              href="complain-report"
              className="w-full from-white/60 to-white/25 bg-gradient-to-br h-40 rounded-xl p-4 flex items-center text-white hover:border-2 hover:border-white duration-75 cursor-pointer"
            >
              <div className="flex-1 flex flex-col justify-start h-full">
                <h1 className="text-base font-bold text-accentBlue-900">
                  Complain
                </h1>
                <div className="text-sm font-normal text-accentBlue-900/80 mt-2 line-clamp-6 text-ellipsis">
                  Complete this form to offer feedback, recognize an employee,
                  make a baggage claim or file a complaint regarding your travel
                  experience.
                </div>
              </div>
              <div>
                <ArrowRight2 className="text-accentBlue-500" />
              </div>
            </Link>
          </div>
        </div>
      </div>
      <footer className="bg-white w-full min-h-[48px] py-2 flex flex-col sm:flex-row justify-between items-center px-4 text-base text-dark-500">
        <div className="whitespace-nowrap">
          © 2023 Buddha Air Pvt. Ltd. All rights reserved.
        </div>
        <div className="flex gap-2 text-sm">
          <a
            href="https://www.buddhaair.com/detail/terms-and-conditions"
            className="whitespace-nowrap"
          >
            Terms and Conditions
          </a>
          <a
            href="https://www.buddhaair.com/detail/privacy-policy"
            className="whitespace-nowrap"
          >
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
}
