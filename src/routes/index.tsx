import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../lib/home-page'

export const Route = createFileRoute('/')({
  component: HomePage,
})
