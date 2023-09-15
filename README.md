# Kassandra Terminal App
📱Download the [latest stable version](https://drive.google.com/drive/folders/1M0eeyp15izPahOpdXiYRApiH0oiFa8Wi?usp=sharing).


## Getting started
1. Make sure your development environment is properly set up.
2. In the project directory, run
`yarn install`
2. Start the development server with
`yarn start`

## FAQ
### How do I package the project into a usable APK file?
1. Reflect version change in ./android/app/build.gradle & in ./src/screens/Settings
2. In the project directory, run
`react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`
3. Now run this command to assemble the debug build:
`cd android && ./gradlew assembleDebug`

You can find the APK file under ./android/app/build/outputs/apk/debug. In 99% of cases, the target device supports the 'arm64-v8' version.

**⚠️ Always create a new branch / push to dev when committing, never push straight to main!**

### How to setup the development environment?
Install [Node](https://nodejs.org/en/) & [Yarn](https://yarnpkg.com/getting-started/install).
