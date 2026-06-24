'use client'

import { useEffect } from 'react'
import PageLayout from './_components/ui/PageLayout'
import PageHeader from './_components/ui/PageHeader'
import CenteredSection from './_components/ui/CenteredSection'
import Text from './_components/ui/Text'
import Button from './_components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <PageLayout>
      <PageHeader title="Next.js Todo" />
      <CenteredSection>
        <Text variant="error">오류가 발생했습니다.</Text>
        <Button onClick={reset}>다시 시도</Button>
      </CenteredSection>
    </PageLayout>
  )
}
