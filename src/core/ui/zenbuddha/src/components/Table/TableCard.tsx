import React from 'react';

interface TableCardProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const TableCard = ({ children, footer }: TableCardProps) => {
  return (
    <div className="bg-whiteShade px-4 py-2 rounded-lg overflow-x-auto custom-scrollbar">
      <table className="table-auto w-full border-separate border-spacing-y-2">
        {children}
      </table>
      {footer}
    </div>
  );
};

export default TableCard;
