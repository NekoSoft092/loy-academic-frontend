import { isRegistered, register, unregister } from '@tauri-apps/api/globalShortcut';
import { appWindow } from '@tauri-apps/api/window';
import { toggleMinimizeAndOpen } from './tauri-window';

export const SHORTCUT_SHOW: string = 'CommandOrControl+Shift+k';

export async function registerShortcuts(): Promise<void> {
  await toogleMinimizeAndOpenShortcut();
}

async function toogleMinimizeAndOpenShortcut(): Promise<void> {
  const isRegisteredCombination = await isRegistered(SHORTCUT_SHOW);
  await appWindow.setAlwaysOnTop(false);

  if(!isRegisteredCombination) {
    await register(SHORTCUT_SHOW, async () => {
      await toggleMinimizeAndOpen();
    });
  }
  else {
    await unregister(SHORTCUT_SHOW);
    await register(SHORTCUT_SHOW, async () => {
     await toggleMinimizeAndOpen();
    });
  }
}

