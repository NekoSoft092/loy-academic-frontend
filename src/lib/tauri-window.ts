import { appWindow } from "@tauri-apps/api/window";
import { platform } from "@tauri-apps/api/os";

// TODO: Refactor on platform.ts
const WindowsPlatform: string = 'win32';

export async function toggleHideAndShow(): Promise <void> {
    appWindow
      .isVisible()
      .then(async (visible) => {
        if (visible) {
          await appWindow.hide();
        } else {
          await appWindow.show();
        }
      })
      .catch(async (err) => {
          console.log(err);
      })
} 

export async function hideWindow(): Promise<void> {
    appWindow
      .isVisible()
      .then(async () => {
        await appWindow.hide();
      })
      .catch(async (err) => {
          console.log(err);
      })
}

export async function toggleMinimizeAndOpen(): Promise <void> {
  const platformName: string = await platform();
  const isMinimized = await appWindow.isMinimized();
  if(isMinimized){
    const isWindows: boolean = platformName === WindowsPlatform;
    !isWindows? await appWindow.show(): await appWindow.unminimize();
    await appWindow.setFocus();
  } else {
    await appWindow.minimize();
  }
}

export async function desktopPlatform(): Promise<string> {
  return await platform();
}