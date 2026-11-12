package com.valerian.tambola;

import android.os.Bundle;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // ponytail: keep screen on while app is foregrounded so auto-calling isn't cut off by screen timeout.
        // Scope to auto-play only (keep-awake plugin) if battery complaints come in.
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }
}
