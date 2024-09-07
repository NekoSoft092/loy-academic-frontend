import type { IMessage } from "@/stores/chat-store";
import { useChatStore } from "@/stores/chat-store";
import './message-component.css';
import { onWeb } from "@/lib/windows";

export function MessageComponent(props: IMessage): JSX.Element {
    const messageSplit: string[] = props.message.split('```');
    const [ setGeneratedPDFMessage ] = useChatStore((state)=> [
        state.setGeneratedPDFMessage
    ])

    const handleClipboard = async (text: string): Promise<void> => {
        await navigator.clipboard.writeText(text);
    }

    const handleGeneratePDF = async (message: IMessage): Promise<void> => {
        setGeneratedPDFMessage(message);
    }

    const dateFormat = (pDate: string): string => {
        const now: Date = new Date();
        const date: Date = new Date(pDate);

        if(now.getDay() === date.getDay() && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear()){
            const minutesFormat: string = date.getMinutes() <= 9 ? `0${date.getMinutes().toString()}`: date.getMinutes().toString();
            if(date.getHours() > 12 && date.getHours() <= 23) {
                const hour: number = date.getHours() - 12;
                return `${hour}:${minutesFormat} PM`;
            }
            return  `${date.getHours()}:${minutesFormat} AM`;
        }
        
        return date.toDateString();
    }

    return (
        <>
        <div className={props.direction === 'incoming' ? "cs-message cs-message--incoming cs-message--single message-component": "cs-message cs-message--outgoing cs-message--single message-component"}>

            { (props.direction==='incoming') && (
            <div className="cs-message__avatar">
                <div className="cs-avatar cs-avatar--md">
                    <img src="/assistants/elena-ia-assistant.svg" alt="Zoe" />
                </div>
            </div>
            )}
            

            <div className="cs-message__content-wrapper">
                <div className="cs-message__content">
                    <div>
                        {messageSplit.map((item: string, index: number) => {
                            if(index % 2 === 0) {
                                return (
                                    <div key={index}>
                                        { props.direction === 'incoming' && (
                                            <div className={index === 0? 'clipboard-header': 'clipboard-content'}>
                                                { index === 0 && (
                                                    <p className="" >{dateFormat(props.sentTime)}</p>
                                                )}
                                               
                                               <div>
                                               <i onClick={async() => { 
                                                    await handleClipboard(item.trim())}}>content_copy</i>

                                                { (index === 0 && !onWeb(window) ) && (
                                                    <i onClick={async() => { 
                                                        await handleGeneratePDF(props)}}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                        <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                                                        <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                                                        </svg>
                                                    </i>
                                                )}
                                               </div>
                                            </div>
                                        )}
                                        <p className={index === 0 ?"txt-message": "txt-message ma"}>{item}</p>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={index} className="code-wrapper secondary reset">
                                        <div className="clipboard-content">
                                            <i onClick={async() => { 
                                            await handleClipboard(item.trim())}}>content_copy</i>
                                        </div>
                                        <code className="code-content">{item.trim()}</code>
                                    </div>
                                    
                                )
                            }
                        })}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}


  