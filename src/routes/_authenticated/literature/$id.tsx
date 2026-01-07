import { createFileRoute } from '@tanstack/react-router'
import LiteratureDetailPage from '@/features/literature/pages/literature-detail'

export const Route = createFileRoute('/_authenticated/literature/$id')({
  component: LiteratureDetailPage,
})
