import BackLink from './BackLink'

interface SubPageHeaderProps {
  title?: string
}

export default function SubPageHeader({ title }: SubPageHeaderProps) {
  return (
    <header className="flex items-center gap-3">
      <BackLink />
      {title && (
        <h1 className="text-[1.5rem] font-bold text-[#1a1a2e] tracking-[-0.5px]">{title}</h1>
      )}
    </header>
  )
}
