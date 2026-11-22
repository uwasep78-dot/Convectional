export function Button({ children, type = 'button', variant = 'primary', disabled = false, className = '', onClick, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-colors disabled:opacity-60 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-var-orange text-white px-5 py-2.5 text-sm hover:bg-var-orange-dark',
    secondary: 'bg-var-navy text-white px-5 py-2.5 text-sm hover:bg-#0b2243',
    outline: 'border border-var-border text-var-text px-5 py-2.5 text-sm hover:bg-var-light-bg',
    ghost: 'text-var-muted hover:text-var-navy px-3 py-2 text-sm',
    danger: 'bg-var-error text-white px-5 py-2.5 text-sm hover:bg-#b91c1c',
    link: 'text-var-navy font-semibold underline underline-offset-4 hover:opacity-80',
  }
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
