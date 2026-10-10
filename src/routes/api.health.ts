import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { health } from '#/lib/health'

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      // vite dev runs with the top-level (prod) vars, so report local explicitly
      GET: () => Response.json(health(import.meta.env.DEV ? 'local' : env.APP_ENV, __COMMIT__)),
    },
  },
})
