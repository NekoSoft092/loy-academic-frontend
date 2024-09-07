

export function onWeb(window: any): boolean {
    return window.__TAURI_METADATA__ === undefined;
}