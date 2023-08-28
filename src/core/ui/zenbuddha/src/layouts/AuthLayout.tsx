/* eslint-disable @next/next/no-img-element */

export default function AuthLayout({
  children,
  logo,
  backgroundImage,
  footer,
}: {
  children?: React.ReactNode;
  logo?: string;
  backgroundImage?: string;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-blueWhite">
      <div className="w-full max-w-5xl bg-white min-h-screen sm:min-h-[600px] max-h-fit mx-0 sm:mx-8 my-0 sm:my-8 grid grid-rows-4 md:grid-rows-none md:grid-cols-3">
        <div className="bg-accentBlue-500 flex row-span-1 md:col-span-1 md:row-auto relative">
          {backgroundImage != null ? (
            <img
              src={backgroundImage}
              alt="buddha_air_logo_white"
              className="absolute w-full h-full object-cover"
            />
          ) : (
            <></>
          )}
          <div className="absolute flex flex-col max-md:flex-row justify-between z-10 top-0 left-0 h-full w-full p-4">
            {logo ? (
              <img
                src={logo}
                alt="buddha_air_logo_white"
                className="h-[34px] w-[160px] object-contain"
              />
            ) : (
              <></>
            )}
            {footer ?? <></>}
          </div>
        </div>
        <div className="row-span-3 md:row-auto md:col-span-2 flex justify-center w-full items-start sm:items-center p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
