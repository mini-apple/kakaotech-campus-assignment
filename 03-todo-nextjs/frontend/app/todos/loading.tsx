import PageLayout from './_components/ui/PageLayout'
import PageHeader from './_components/ui/PageHeader'
import EmptyState from './_components/ui/EmptyState'

export default function Loading() {
  return (
    <PageLayout>
      <PageHeader title="Next.js Todo" subtitle="오늘의 할 일을 관리하세요" />
      <EmptyState message="로딩 중..." variant="loading" />
    </PageLayout>
  )
}
