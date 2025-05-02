export default {
  name: 'phone-review-app',
  slug: 'phone-review-app',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.phonereview.app'
  },
  android: {
    package: 'com.phonereview.app'
  },
  plugins: ['expo-router'],
  scheme: 'phone-review-app',
  extra: {
    router: {
      origin: false
    },
    eas: {
      projectId: 'your-project-id'
    }
  }
}; 