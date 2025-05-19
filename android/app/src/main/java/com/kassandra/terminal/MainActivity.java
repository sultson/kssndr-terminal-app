package com.kassandra.terminal;

import android.os.Bundle;

//import androidx.core.view.WindowCompat;
//import androidx.core.view.WindowInsetsCompat;
//import androidx.core.view.WindowInsetsControllerCompat;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import android.content.ComponentCallbacks2;
import android.view.View;

public class MainActivity extends ReactActivity
  implements ComponentCallbacks2 {
    public void onTrimMemory(int level) {

      switch (level) {

        case ComponentCallbacks2.TRIM_MEMORY_MODERATE:
        case ComponentCallbacks2.TRIM_MEMORY_COMPLETE:
        case ComponentCallbacks2.TRIM_MEMORY_RUNNING_LOW:
        case ComponentCallbacks2.TRIM_MEMORY_RUNNING_CRITICAL:
          Runtime.getRuntime().gc();
          break;
        default:

          break;
      }
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
      return "KassandraTerminal";
    }

    /**
     * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
     * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
     * (aka React 18) with two boolean flags.
     */
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
      return new DefaultReactActivityDelegate(
              this,
              getMainComponentName(),
              // If you opted-in for the New Architecture, we enable the Fabric Renderer.
              DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
              // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
              DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
      );
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {

      super.onCreate(null);
//      View decorView = getWindow().getDecorView();
//      // Hide both the navigation bar and the status bar.
//      // SYSTEM_UI_FLAG_FULLSCREEN is only available on Android 4.1 and higher, but as
//      // a general rule, you should design your app to hide the status bar whenever you
//      // hide the navigation bar.
//      int uiOptions = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
//              | View.SYSTEM_UI_FLAG_FULLSCREEN;
//      decorView.setSystemUiVisibility(uiOptions);

    }


}





