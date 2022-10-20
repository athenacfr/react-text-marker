import { resolve } from 'node:path'
import { defineConfig, mergeConfig } from 'vite'
import dts from 'vite-plugin-dts'

import viteConfig from './vite.config'

const outputDir = resolve(__dirname, 'dist/lib')
const libDir = resolve(__dirname, 'lib')
const libName = 'react-text-marker'

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [
      dts({
        outputDir,
        include: libDir,
      }),
    ],
    build: {
      outDir: outputDir,
      sourcemap: true,
      lib: {
        entry: resolve(libDir, 'index.ts'),
        name: libName,
        formats: ['es', 'umd'],
        fileName: (format) => `${libName}.${format}.js`,
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
    },
  })
)
