type ButtonProps = React.ComponentPropsWithRef<"button">;

export const Button = ({ children, className, ...rest }: ButtonProps) => {
  return (
    <button
      className={`mx-2 rounded-md bg-white px-4 py-2 text-sm text-red-500 md:text-lg ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
