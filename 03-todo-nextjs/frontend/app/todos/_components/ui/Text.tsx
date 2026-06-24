type Variant = 'error' | 'hint'

const variantClass: Record<Variant, string> = {
  error: 'text-[0.82rem] text-[#d93025]',
  hint: 'text-[0.88rem] text-[#888]',
}

interface TextProps {
  variant: Variant
  children: React.ReactNode
  className?: string
}

export default function Text({ variant, children, className = '' }: TextProps) {
  return <p className={`${variantClass[variant]} ${className}`}>{children}</p>
}
