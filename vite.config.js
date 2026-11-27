import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function staticFallback() {
  return {
    name: 'dawak-static-fallback',
    apply: 'build',
    closeBundle() {
      const html = readFileSync(resolve('dist/index.html'), 'utf8')
      writeFileSync(resolve('dist/404.html'), html)
      writeFileSync(resolve('dist/_redirects'), '/* /index.html 200\n')
    },
  }
}

const pagesBase = process.env.GITHUB_PAGES === 'true' || process.env.GITHUB_ACTIONS === 'true'

export default defineConfig({
  base: pagesBase ? '/dawak-mvp/' : '/',
  plugins: [react(), staticFallback()],
})
