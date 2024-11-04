import { type CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'loy.mobile.app',
  appName: 'Loy',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
}

export default config
