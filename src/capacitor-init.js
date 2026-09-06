import { Capacitor } from '@capacitor/core';

export async function initNativeBridge() {
  if (!Capacitor.isNativePlatform()) return;

  const { StatusBar, Style } = await import('@capacitor/status-bar');
  const { SplashScreen } = await import('@capacitor/splash-screen');

  StatusBar.setStyle({ style: Style.Dark });
  StatusBar.setBackgroundColor({ color: '#0c0c11' });
  SplashScreen.hide();
}
