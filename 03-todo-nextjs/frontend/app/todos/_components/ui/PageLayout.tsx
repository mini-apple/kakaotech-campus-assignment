export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col gap-8 flex-1">
      {children}
    </div>
  )
}
