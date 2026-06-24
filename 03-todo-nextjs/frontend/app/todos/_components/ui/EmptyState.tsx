type Variant = 'empty' | 'loading'

const variantClass: Record<Variant, string> = {
  empty: 'text-[#bbb] text-[0.9rem]',
  loading: 'text-[#9b7fd4] text-[0.95rem] animate-pulse',
}

interface EmptyStateProps {
  message: string
  variant?: Variant
}

export default function EmptyState({ message, variant = 'empty' }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <p className={variantClass[variant]}>{message}</p>
    </div>
  )
}
