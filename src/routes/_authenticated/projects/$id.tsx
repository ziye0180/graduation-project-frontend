import { createFileRoute } from '@tanstack/react-router'
import ProjectDetailPage from '@/features/projects/pages/project-detail'

export const Route = createFileRoute('/_authenticated/projects/$id')({
  component: ProjectDetailPage,
})
