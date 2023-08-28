interface FormGroupProps {
  title?: string;
  children: React.ReactNode;
}

const FormGroup = ({ title, children }: FormGroupProps) => {
  return (
    <div className="flex border-b last-of-type:border-none p-4 max-md:flex-col">
      {title ? (
        <div className="font-bold text-dark-500 w-36 md:w-52 mr-2 max-md:mb-2 whitespace-nowrap">
          {title}
        </div>
      ) : (
        <></>
      )}

      <div className="flex-1">{children}</div>
    </div>
  );
};

export default FormGroup;
