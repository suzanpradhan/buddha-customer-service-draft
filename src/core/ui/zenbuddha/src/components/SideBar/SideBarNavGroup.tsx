'use client';

import { ArrowDown2, ArrowRight2 } from 'iconsax-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SideBarNavGroupProps {
  title: string;
  segment: string;
  children?: React.ReactNode;
}

const SideBarNavGroup = ({
  title,
  segment,
  children,
}: SideBarNavGroupProps) => {
  const [toggle, setToggle] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    setToggle(pathName.startsWith('/' + segment) ? true : false);
  }, [pathName, setToggle, segment]);

  return (
    <div
      className={
        `px-3 py-2 text-primaryGray-500 font-medium my-[2px] rounded-md flex flex-col items-start nav-group group ` +
        (toggle ? 'bg-whiteShade' : 'bg-white')
      }
    >
      <button
        className={
          `flex justify-between items-center w-full text-sm whitespace-nowrap ` +
          (toggle ? 'mb-2' : '')
        }
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        {title}
        {toggle ? (
          <ArrowDown2 className="text-primaryGray-500" size={16} />
        ) : (
          <ArrowRight2 className="text-primaryGray-500" size={16} />
        )}
      </button>

      {toggle ? children : <></>}
    </div>
  );
};

export default SideBarNavGroup;
