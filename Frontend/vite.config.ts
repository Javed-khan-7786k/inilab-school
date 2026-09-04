import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    allowedHosts: [
      'lethargy-catchable-mushy.ngrok-free.dev'
    ]
  }
})
// import { defineConfig } from 'vite';

// export default defineConfig({
//   server: {
//     allowedHosts: [
//       'lethargy-catchable-mushy.ngrok-free.dev'
//     ]
//   }
// });