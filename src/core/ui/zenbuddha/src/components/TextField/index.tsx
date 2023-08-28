export interface TextFieldProps {
  label?: string;
  placeholder?: string;
  id: string;
  name?: string;
  type?: string;
  isMulti?: boolean;
  rows?: number;
  className?: string;
  required?: boolean;
  suffix?: React.ReactNode;
}

const TextField = ({
  className,
  isMulti = false,
  ...props
}: TextFieldProps) => {
  return (
    <div className={`flex flex-col last-of-type:mb-0 ` + className}>
      {props.label ? (
        <label htmlFor={props.id} className="text-sm mb-2 text-dark-500">
          {props.label}
          {props.required ? '*' : ''}
        </label>
      ) : (
        <></>
      )}
      {isMulti ? (
        <div className="flex border items-center rounded-md bg-slate-50">
          <textarea
            className="flex-1 py-3 px-4 rounded-md bg-slate-50 text-sm focus:outline-none custom-scrollbar"
            cols={30}
            rows={props.rows}
            {...props}
          ></textarea>
          {props.suffix ? <div className="mr-2">{props.suffix}</div> : <></>}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-end sm:items-center border-0 sm:border rounded-md bg-transparent sm:bg-slate-50">
          <input
            className="flex-1 py-3 pl-4 h-11 border sm:border-0 rounded-md bg-slate-50 text-sm focus:outline-none w-full"
            {...props}
          />
          {props.suffix ? (
            <div className="sm:mr-2 mt-2 sm:mt-0">{props.suffix}</div>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};

export default TextField;
