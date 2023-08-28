export interface PageBarProps {
  leading?: React.ReactNode;
  children?: React.ReactNode;
  bottom?: React.ReactNode;
}

const PageBar = ({ leading, children, bottom }: PageBarProps) => {
  return (
    <div className="flex flex-col border-b border-t pl-4">
      <div className="flex min-h-[3rem] items-center justify-between pr-4">
        {leading}
        <div className="flex gap-2">{children}</div>
      </div>
      {bottom}
    </div>
  );
};

export default PageBar;
