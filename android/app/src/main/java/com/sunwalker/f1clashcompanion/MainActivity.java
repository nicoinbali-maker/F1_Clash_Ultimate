package com.sunwalker.f1clashcompanion;

import android.app.AlertDialog;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		maybePromptOverlayPermission();
	}

	private void maybePromptOverlayPermission() {
		if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
			return;
		}

		if (Settings.canDrawOverlays(this)) {
			return;
		}

		new AlertDialog.Builder(this)
			.setTitle("Overlay-Berechtigung")
			.setMessage("Fuer den Capture-Button ueber F1 Clash braucht die App die Overlay-Berechtigung. Bitte jetzt aktivieren.")
			.setCancelable(false)
			.setPositiveButton("Jetzt aktivieren", (dialog, which) -> openOverlaySettings())
			.setNegativeButton("Spaeter", null)
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
}
