# POS Terminal App 📱

Certified since April 2023 to run on the following Verifone terminal models:
- P630 (with physical keypad) - [Info](https://www.verifone.com/sites/default/files/2022-09/P630_DataSheet_9.9.2022.pdf)
- T650p (standalone with optional printer) - [Info](https://www.verifone.com/sites/default/files/legal/t650p_datasheet_07_2020_1.pdf)
  



## Getting started
1. Make sure to follow the React Native [setup guide](https://reactnative.dev/docs/set-up-your-environment) in case this is your first project with this framework.
   
   - ⚠️ This project is Android-only.
     
2. In the project directory, run
`yarn install`
3. Start the development server with
`yarn start`

## FAQ
### How do I package the project into a usable APK file?
1. Reflect version change in ./android/app/build.gradle
   
2. In the project directory, run
`react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`
3. Now run this command to assemble the debug build:
`cd android && ./gradlew assembleDebug`

You can find the APK file under ./android/app/build/outputs/apk/debug. In 99% of cases, the target (Android) device supports the 'arm64-v8' version.


### Node? Yarn?
Install [Node](https://nodejs.org/en/) & [Yarn](https://yarnpkg.com/getting-started/install).
