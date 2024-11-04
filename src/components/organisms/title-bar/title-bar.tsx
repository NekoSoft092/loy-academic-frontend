import { appWindow } from '@tauri-apps/api/window';
import './title-bar.css';

export function TitleBarComponent(): JSX.Element {

    // Minimize Button
    const handleMinimize = async(): Promise<void> => {
        await appWindow.minimize();
    } 

    // Close Button
    const handleClose = async(): Promise<void> => {
        await appWindow.close();
    }

    return (
        <div data-theme="cupcake">
            <div data-tauri-drag-region className="titlebar bg-primary">
                <div className="titlebar-button" id="titlebar-minimize" onClick={handleMinimize}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                    </svg>
                </div>

                <div className="titlebar-button" id="titlebar-close" onClick={handleClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
    )
}