import '../css/app.css'
import { pageManifest } from '@/.guren/pages.gen'

let pages: Record<string, () => Promise<unknown>> | undefined

try {
  pages = import.meta.glob!('./pages/**/*.tsx')
} catch {
  pages = undefined
}

void Promise.all([import('@guren/inertia-client'), import('@guren/inertia-client/live')]).then(([{ startInertiaClient }, { liveTransport }]) =>
  startInertiaClient({
    pages,
    pageManifest,
    live: liveTransport(),
    resolve: pages
      ? undefined
      : (name) => import(/* @vite-ignore */ pageManifest[name as keyof typeof pageManifest] ?? `./pages/${name}.tsx`),
  }),
)
