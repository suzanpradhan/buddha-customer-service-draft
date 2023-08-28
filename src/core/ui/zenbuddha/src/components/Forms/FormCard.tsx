import { FormEventHandler } from 'react';

interface FormCardProps {
  children: React.ReactNode;
  onSubmit?: FormEventHandler<HTMLFormElement> | undefined;
  className?: string;
}

const FormCard = ({ children, onSubmit, className }: FormCardProps) => {
  return (
    <form
      className={`border rounded-xl flex flex-col max-w-5xl ` + className}
      onSubmit={(event) => {
        event.preventDefault();
        if (!onSubmit) {
          return;
        }
        onSubmit(event);
      }}
    >
      {children}
    </form>
  );
};

export default FormCard;
