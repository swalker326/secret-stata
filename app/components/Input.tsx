type InputProps = React.ComponentPropsWithRef<"input"> & {
  label?: React.ReactNode;
  error?: {
    message: string;
    isError: boolean;
  };
};
export const Input = ({ error, className, ...rest }: InputProps) => {
  return (
    <div>
      <input
        aria-invalid={error?.isError ? true : undefined}
        className={`w-full rounded border border-gray-500 p-2 text-lg ${className}`}
        {...rest}
      />
      {error?.isError && (
        <div className="pt-1 text-red-700" id="password-error">
          {error.message}
        </div>
      )}
    </div>
  );
};
