interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  children: React.ReactNode
}

export function Button({ children, className, ...props }: ButtonProps) {
  const buttonConfig = {
    className: 'cursor-pointer flex items-center justify-center',
  }

  return (
    <button
      {...props}
      className={
        className ? className + ' cursor-pointer' : buttonConfig.className
      }
    >
      {children}
    </button>
  )
}
