'use client';

import DatePicker, { DatePickerProps } from 'react-date-picker';
import { Value } from 'react-date-picker/dist/cjs/shared/types';

type AdditionalDateSelectorProps = {
  label?: string;
  id: string;
  className?: string;
  onChange?: ((value: Date) => void) | undefined;
};

export type DateSelectorProps = DatePickerProps & AdditionalDateSelectorProps;

const DateSelector = ({
  id,
  className,
  label,
  onChange,
  ...props
}: DateSelectorProps) => {
  return (
    <div className={`flex flex-col last-of-type:mb-0 ` + className}>
      {label ? (
        <label htmlFor={id} className="text-sm mb-2 text-dark-500">
          {label}
          {label ? '*' : ''}
        </label>
      ) : (
        <></>
      )}
      <DatePicker
        id={id}
        onChange={(value: Value) => {
          if (onChange && value) {
            onChange(value as Date);
          }
        }}
        className="h-11 border rounded-md bg-slate-50 outline-none px-3"
        {...props}
      />
    </div>
  );
};

export default DateSelector;
