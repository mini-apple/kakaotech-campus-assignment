import { createTodo } from '@/app/actions'
import PageLayout from '../_components/ui/PageLayout'
import SubPageHeader from '../_components/ui/SubPageHeader'
import FormField from '../_components/ui/FormField'
import ButtonRow from '../_components/ui/ButtonRow'
import Button from '../_components/ui/Button'
import LinkButton from '../_components/ui/LinkButton'

export default function NewTodoPage() {
  return (
    <PageLayout>
      <SubPageHeader title="새 Todo" />

      <form action={createTodo} className="flex flex-col gap-4">
        <FormField
          label="할 일"
          name="title"
          placeholder="할 일을 입력하세요"
          maxLength={100}
          required
        />
        <ButtonRow>
          <Button type="submit" className="flex-1 py-3 text-[0.95rem]">
            추가
          </Button>
          <LinkButton href="/todos">취소</LinkButton>
        </ButtonRow>
      </form>
    </PageLayout>
  )
}
