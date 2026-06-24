import { getTodo, updateTodo, deleteTodo } from '@/app/actions'
import PageLayout from '../_components/ui/PageLayout'
import SubPageHeader from '../_components/ui/SubPageHeader'
import EmptyState from '../_components/ui/EmptyState'
import FormField from '../_components/ui/FormField'
import CheckboxField from '../_components/ui/CheckboxField'
import ButtonRow from '../_components/ui/ButtonRow'
import Button from '../_components/ui/Button'
import LinkButton from '../_components/ui/LinkButton'

export default async function TodoDetailPage({
  params,
}: {
  params: Promise<{ todoId: string }>
}) {
  const { todoId } = await params
  const todo = await getTodo(todoId)

  if (!todo) {
    return (
      <PageLayout>
        <SubPageHeader />
        <EmptyState message={`Todo를 찾을 수 없습니다. (id: ${todoId})`} />
      </PageLayout>
    )
  }

  const updateAction = updateTodo.bind(null, todo.id.toString())
  const deleteAction = deleteTodo.bind(null, todo.id.toString())

  return (
    <PageLayout>
      <SubPageHeader title="Todo 수정" />

      <form action={updateAction} className="flex flex-col gap-4">
        <FormField
          label="할 일"
          name="title"
          defaultValue={todo.title}
          maxLength={100}
          required
        />
        <CheckboxField name="completed" label="완료됨" defaultChecked={todo.completed} />
        <ButtonRow>
          <Button type="submit" className="flex-1 py-3 text-[0.95rem]">
            저장
          </Button>
          <LinkButton href="/todos">취소</LinkButton>
        </ButtonRow>
      </form>

      <form action={deleteAction} className="mt-auto">
        <Button type="submit" variant="danger" className="w-full py-3 text-[0.95rem]">
          삭제
        </Button>
      </form>
    </PageLayout>
  )
}
