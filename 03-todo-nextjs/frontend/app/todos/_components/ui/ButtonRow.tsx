export default function ButtonRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 pt-2">
      {children}
    </div>
  )
}
