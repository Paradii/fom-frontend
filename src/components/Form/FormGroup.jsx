const FormGroup = ({
  label,
  labelNote,
  required,
  error,
  hint,
  htmlFor,
  children,
  className = "",
  labelClassName = "text-base font-medium text-ink",
}) => {
  return (
    <div className={`grid content-start gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className={labelClassName}>
          {label}
          {required && <span> *</span>}
          {labelNote && (
            <span className="font-normal text-ink-3"> {labelNote}</span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <span role="alert" className="text-sm text-danger">
          {error}
        </span>
      ) : (
        hint && <span className="text-sm text-ink-3">{hint}</span>
      )}
    </div>
  );
};

export default FormGroup;
