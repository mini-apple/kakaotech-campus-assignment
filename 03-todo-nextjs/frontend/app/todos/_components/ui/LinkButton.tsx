import Link from 'next/link'

interface LinkButtonProps {
  href: string
  children: React.ReactNode
}

export default function LinkButton({ href, children }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className="flex-1 py-3 bg-[#f0f0f0] text-[#555] font-semibold text-[0.95rem] rounded-[10px] text-center hover:bg-[#e0e0e0] active:scale-[0.97] transition-all duration-200"
    >
      {children}
    </Link>
  )
}
