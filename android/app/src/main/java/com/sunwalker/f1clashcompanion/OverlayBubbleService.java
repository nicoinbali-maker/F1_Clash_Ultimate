package com.sunwalker.f1clashcompanion;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.TextView;

import androidx.core.app.NotificationCompat;

public class OverlayBubbleService extends Service {
    private static final String CHANNEL_ID = "f1_overlay_channel";
    private static final int NOTIFICATION_ID = 10177;

    private WindowManager windowManager;
    private View bubbleView;
    private WindowManager.LayoutParams bubbleParams;

    @Override
    public void onCreate() {
        super.onCreate();
        startInForeground();
        showOverlayBubble();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (bubbleView == null) {
            showOverlayBubble();
        }
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        removeOverlayBubble();
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void startInForeground() {
        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (manager != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "F1 Clash Overlay",
                NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Steuert den schwebenden F1 Capture-Button");
            manager.createNotificationChannel(channel);
        }

        Intent launchIntent = getPackageManager().getLaunchIntentForPackage(getPackageName());
        PendingIntent pendingIntent = null;
        if (launchIntent != null) {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            int flags = Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
                ? PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                : PendingIntent.FLAG_UPDATE_CURRENT;
            pendingIntent = PendingIntent.getActivity(this, 1001, launchIntent, flags);
        }

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle("F1 Clash Companion Overlay aktiv")
            .setContentText("Tippe den schwebenden F1-Button, um die App zu oeffnen.")
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setContentIntent(pendingIntent)
            .build();

        startForeground(NOTIFICATION_ID, notification);
    }

    private void showOverlayBubble() {
        if (bubbleView != null) return;

        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        if (windowManager == null) return;

        int type = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
            ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            : WindowManager.LayoutParams.TYPE_PHONE;

        bubbleParams = new WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            type,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        );
        bubbleParams.gravity = Gravity.TOP | Gravity.START;
        bubbleParams.x = 24;
        bubbleParams.y = 260;

        TextView bubble = new TextView(this);
        bubble.setText("F1");
        bubble.setTextSize(14f);
        bubble.setTextColor(0xFF06080F);
        bubble.setPadding(28, 18, 28, 18);
        bubble.setBackgroundColor(0xFF79E9FF);
        bubble.setElevation(14f);

        bubble.setOnClickListener(v -> {
            Intent launchIntent = getPackageManager().getLaunchIntentForPackage(getPackageName());
            if (launchIntent != null) {
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                startActivity(launchIntent);
            }
        });

        bubble.setOnLongClickListener(v -> {
            stopSelf();
            return true;
        });

        bubble.setOnTouchListener(new View.OnTouchListener() {
            private int initialX;
            private int initialY;
            private float initialTouchX;
            private float initialTouchY;

            @Override
            public boolean onTouch(View view, MotionEvent event) {
                if (bubbleParams == null || windowManager == null) return false;

                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        initialX = bubbleParams.x;
                        initialY = bubbleParams.y;
                        initialTouchX = event.getRawX();
                        initialTouchY = event.getRawY();
                        return false;
                    case MotionEvent.ACTION_MOVE:
                        bubbleParams.x = initialX + (int) (event.getRawX() - initialTouchX);
                        bubbleParams.y = initialY + (int) (event.getRawY() - initialTouchY);
                        windowManager.updateViewLayout(bubble, bubbleParams);
                        return true;
                    default:
                        return false;
                }
            }
        });

        bubbleView = bubble;
        windowManager.addView(bubbleView, bubbleParams);
    }

    private void removeOverlayBubble() {
        if (windowManager != null && bubbleView != null) {
            try {
                windowManager.removeView(bubbleView);
            } catch (Exception ignored) {
            }
        }
        bubbleView = null;
    }
}
