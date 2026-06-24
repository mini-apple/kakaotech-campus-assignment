export default function CenteredSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      {children}
    </div>
  )
}
