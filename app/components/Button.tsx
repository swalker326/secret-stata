type ButtonVariant = "primary" | "red";
type ButtonProps = React.ComponentPropsWithRef<"button"> & {
  variant?: ButtonVariant;
};

export const Button = ({
  children,
  variant = "primary",
  className,
  ...rest
}: ButtonProps) => {
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-white text-red-500 hover:bg-slate-100 ",
    red: "bg-red-500 text-white hover:bg-red-600",
  };
  return (
    <button
      className={`mx-2 rounded-md px-4 py-2 text-sm md:text-lg ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
