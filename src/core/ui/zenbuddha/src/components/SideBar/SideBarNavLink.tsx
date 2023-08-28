'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SideBarNavGroupProps {
  title?: string;
  link: string;
  linkExact?: boolean;
}

const SideBarNavLink = ({
  title,
  link,
  linkExact = false,
}: SideBarNavGroupProps) => {
  const [toggle, setToggle] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    if (linkExact) {
      setToggle(pathName == link ? true : false);
    } else {
      setToggle(pathName.startsWith(link) ? true : false);
    }
  }, [pathName, setToggle, link, linkExact]);

  return (
    <Link
      href={link}
      className={
        `flex items-center px-3 py-2 my-[2px] text-primaryGray-500 font-medium text-sm w-full rounded-md h-10 group-[&.nav-group]:h-auto whitespace-nowrap ` +
        (toggle ? 'bg-whiteShade group-[&.nav-group]:bg-white' : '')
      }
      onClick={() => {
        if (!pathName.startsWith(link)) {
          setToggle(!toggle);
        }
      }}
    >
      {title}
    </Link>
  );
};

export default SideBarNavLink;
