import { forwardRef, type InputHTMLAttributes } from 'react'

type Variant = 'default' | 'editing'

const variantClass: Record<Variant, string> = {
  default: 'px-4 py-3 border-2 border-[#e0d6f7] rounded-[10px] focus:border-primary',
  editing: 'px-[10px] py-[6px] border-2 border-primary rounded-[8px]',
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: Variant
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`text-[0.95rem] bg-white text-[#1a1a2e] outline-none transition-colors duration-200 ${variantClass[variant]} ${className}`}
      {...props}
    />
  )
)

Input.displayName = 'Input'

export default Input
