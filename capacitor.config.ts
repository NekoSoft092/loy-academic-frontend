import { type CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'sage.mobile.app',
  appName: 'Sage',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
}

export default config
