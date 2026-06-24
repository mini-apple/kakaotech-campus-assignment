import { type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md'

const variantClass: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-[#5621c0]',
  secondary: 'bg-[#f0f0f0] text-[#555] hover:bg-[#e0e0e0]',
  danger: 'bg-[#fce8e8] text-[#d93025] hover:bg-[#f5c6c6]',
  ghost: 'bg-[#eee8fd] text-primary hover:bg-[#ddd0fb]',
}

const sizeClass: Record<Size, string> = {
  sm: 'px-3 py-[6px] text-[0.8rem] rounded-[8px]',
  md: 'px-5 py-3 text-[0.9rem] rounded-[10px]',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`border-none font-semibold cursor-pointer active:scale-[0.97] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
