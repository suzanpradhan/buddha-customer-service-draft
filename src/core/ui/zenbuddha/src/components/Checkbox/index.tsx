import { ChangeEventHandler } from 'react';

export interface CheckboxProps {
  label?: string;
  className?: string;
  name?: string;
  id: string;
  checked?: boolean;
  value?: number | string;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
}

const Checkbox = (props: CheckboxProps) => {
  return (
    <div className="flex items-start gap-2 w-fit">
      <input
        id={props.id}
        type="checkbox"
        name={props.name}
        onChange={props.onChange}
        checked={props.checked}
        value={props.value}
        className={
          `w-5 h-5 accent-accent focus:ring-accent checked:bg-accent focus:ring-2 before:bg-white cursor-pointer ` +
          props.className
        }
      />
      {props.label ? (
        <label
          htmlFor={props.id}
          className="text-sm font-normal cursor-pointer capitalize"
        >
          {props.label}
        </label>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Checkbox;
