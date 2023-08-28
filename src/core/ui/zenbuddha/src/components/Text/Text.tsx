export interface TextProps {
  label: string;
  className?: string;
}

const Text = (props: TextProps) => {
  return <div className="">{props.label}</div>;
};

export default Text;
