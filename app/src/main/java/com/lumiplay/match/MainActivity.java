package com.lumiplay.match;
import android.app.Activity;
import android.os.Bundle;
import android.graphics.Color;
import android.webkit.WebView;
import android.widget.FrameLayout;

/** Offline game packaged as an Android application. */
public final class MainActivity extends Activity {
    private WebView game;
    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(248,245,238));
        root.setOnApplyWindowInsetsListener((view, insets) -> {
            view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(), insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets;
        });
        game = new WebView(this);
        game.setBackgroundColor(Color.rgb(248,245,238));
        game.getSettings().setJavaScriptEnabled(true);
        game.getSettings().setDomStorageEnabled(true);
        game.getSettings().setAllowContentAccess(false);
        game.getSettings().setAllowFileAccessFromFileURLs(false);
        game.getSettings().setAllowUniversalAccessFromFileURLs(false);
        game.setOverScrollMode(WebView.OVER_SCROLL_NEVER);
        root.addView(game, new FrameLayout.LayoutParams(-1,-1));
        setContentView(root);
        game.loadUrl("file:///android_asset/index.html");
    }
    @Override protected void onPause() { game.onPause(); super.onPause(); }
    @Override protected void onResume() { super.onResume(); if (game != null) game.onResume(); }
    @Override protected void onDestroy() { game.destroy(); super.onDestroy(); }
}
