import Link from 'next/link';
import { MouseEventHandler } from 'react';
import Spinner from '../Spinner';

export interface ButtonProps {
  text?: string;
  isLoading?: boolean;
  className?: string;
  textClassName?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  buttonType?: 'bordered' | 'flat';
  type?: 'button' | 'submit' | 'reset' | 'link';
  kind?: 'default' | 'success' | 'danger' | 'warning' | 'secondary';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  href?: string;
  tooltip?: string;
}

const Button = ({ buttonType = 'flat', kind, ...props }: ButtonProps) => {
  var color = 'bg-accentBlue-500 text-white';

  if (buttonType == 'bordered') {
    color = 'bg-transparent text-dark-500 ';
  } else {
    switch (kind) {
      case 'default':
        color = 'bg-accentBlue-400 text-white';
        break;
      case 'secondary':
        color = 'bg-dark-500 text-white';
        break;
      case 'success':
        color = 'bg-green-400 text-white';
        break;
      case 'danger':
        color = 'bg-red-200 text-red-500';
        break;
      case 'warning':
        color = 'bg-yellow-200 text-yellow-500';
        break;
      default:
        break;
    }
  }

  if (props.type == 'link') {
    return (
      <Link
        title={props.tooltip}
        className={
          `${
            buttonType == 'bordered' ? 'border' : ''
          } ${color} rounded-md h-12 text-sm font-normal flex justify-center items-center hover:opacity-95 px-3 whitespace-nowrap ` +
          props.className
        }
        href={props.href!}
      >
        {props.isLoading ? (
          <Spinner />
        ) : (
          <div className="flex justify-center items-center">
            {props.prefix}
            <div className={props.textClassName}>{props.text}</div>
            {props.suffix}
          </div>
        )}
      </Link>
    );
  }

  return (
    <button
      onClick={props.onClick}
      title={props.tooltip}
      type={props.type ?? 'button'}
      className={
        `${
          buttonType == 'bordered' ? 'border' : ''
        } ${color} rounded-md h-12 text-sm font-normal flex justify-center items-center hover:opacity-95 px-3 whitespace-nowrap ` +
        props.className
      }
    >
      {props.isLoading ? (
        <Spinner />
      ) : (
        <div className="flex justify-center items-center">
          {props.prefix}
          <div className={props.textClassName}>{props.text}</div>
          {props.suffix}
        </div>
      )}
    </button>
  );
};

export default Button;
