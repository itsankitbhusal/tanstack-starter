import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    resolve: { tsconfigPaths: true },
    plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
    server: {
      port: Number(env.PORT) || 5173,
      proxy: {
        ...(mode === 'development' &&
        env.VITE_API_BASE_URL
          ? {
              '/api': {
                target: env.VITE_API_BASE_URL,
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ''),
              },
            }
          : {}),
      },
    },
  }
})

export default config
