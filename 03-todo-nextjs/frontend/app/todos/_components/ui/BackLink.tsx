import Link from 'next/link'

export default function BackLink() {
  return (
    <Link
      href="/todos"
      className="text-[0.9rem] text-primary hover:text-[#5621c0] transition-colors"
    >
      ← 목록으로
    </Link>
  )
}
