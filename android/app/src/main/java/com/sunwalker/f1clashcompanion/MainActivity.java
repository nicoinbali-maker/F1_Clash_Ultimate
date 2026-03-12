package com.sunwalker.f1clashcompanion;

import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        checkAndSetupOverlay();
    }

    @Override
    public void onResume() {
        super.onResume();
        checkAndSetupOverlay();
    }

    private void checkAndSetupOverlay() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return;
        }

        if (!Settings.canDrawOverlays(this)) {
            promptOverlayPermission();
        } else {
            maybePromptOverlayReEnable();
            ensureOverlayServiceRunning();
        }
    }

    private void promptOverlayPermission() {
        new AlertDialog.Builder(this)
            .setTitle(R.string.overlay_permission_title)
            .setMessage(R.string.overlay_permission_message)
            .setCancelable(false)
            .setPositiveButton(R.string.overlay_permission_positive, (dialog, which) -> openOverlaySettings())
            .setNegativeButton(R.string.overlay_permission_negative, null)
            .show();
    }

    private void maybePromptOverlayReEnable() {
        SharedPreferences prefs = getSharedPreferences(OverlayBubbleService.PREFS_NAME, MODE_PRIVATE);
        if (OverlayBubbleService.isOverlayEnabled(prefs)) return;

        new AlertDialog.Builder(this)
            .setTitle(R.string.overlay_disabled_title)
            .setMessage(R.string.overlay_disabled_message)
            .setCancelable(true)
            .setPositiveButton(R.string.overlay_disabled_positive, (dialog, which) -> {
                OverlayBubbleService.setOverlayEnabled(prefs, true);
                ensureOverlayServiceRunning();
            })
            .setNegativeButton(R.string.overlay_permission_negative, null)
            .show();
    }

    private void openOverlaySettings() {
        Intent intent = new Intent(
            Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
            Uri.parse("package:" + getPackageName())
        );
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
    }

    private void ensureOverlayServiceRunning() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) return;

        SharedPreferences prefs = getSharedPreferences(OverlayBubbleService.PREFS_NAME, MODE_PRIVATE);
        if (!OverlayBubbleService.isOverlayEnabled(prefs)) return;

        Intent serviceIntent = new Intent(this, OverlayBubbleService.class);
        serviceIntent.setAction(OverlayBubbleService.ACTION_ENABLE);
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(serviceIntent);
            } else {
                startService(serviceIntent);
            }
        } catch (RuntimeException ignored) {
            // Avoid process crash if OEM/OS blocks foreground service start in this state.
        }
    }
}
