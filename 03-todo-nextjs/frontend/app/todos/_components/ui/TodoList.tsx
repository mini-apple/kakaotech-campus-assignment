export default function TodoList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="flex flex-col gap-[10px] list-none">
      {children}
    </ul>
  )
}
