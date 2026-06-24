interface PageHeaderProps {
  title: string
  subtitle?: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="text-center">
      <h1 className="text-[2rem] font-bold text-primary tracking-[-0.5px]">{title}</h1>
      {subtitle && (
        <p className="mt-[6px] text-[0.9rem] text-[#888]">{subtitle}</p>
      )}
    </header>
  )
}
