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
        <>
            <div data-tauri-drag-region className="titlebar primary">
                <div className="titlebar-button" id="titlebar-minimize" onClick={handleMinimize}>
                    <i className='tiny fill secundary-text item-remove'>remove</i>
                </div>

                <div className="titlebar-button" id="titlebar-close" onClick={handleClose}>
                    <i className='tiny fill secundary-text item-close'>close</i>
                </div>
            </div>
        </>
    )
}