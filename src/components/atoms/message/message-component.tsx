import type { IMessage } from "@/stores/chat-store";
import { useChatStore } from "@/stores/chat-store";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark as dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
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

    const codeLanguage = (codeLang: string): string => {
        if(codeLang.includes('jsx')) {
          return 'javascript';
        }
        return codeLang;
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
        <div className={props.direction === 'incoming' ? "cs-message cs-message--incoming cs-message--single message-component bg-base-300 pl-4 pr-4": "cs-message cs-message--outgoing cs-message--single message-component bg-base-300 pl-4 pr-4 rounded-md"}
            style={{borderRadius: '5px'}}>

            { (props.direction==='incoming') && (
            <div className="flex justify-center items-start pt-2">
                <div className="cs-avatar cs-avatar--md reset">
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
                                               
                                               <div className="flex gap-2">

                                                <i onClick={async() => { 
                                                    await handleClipboard(item.trim())}}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                                    </svg>
                                                </i>
                                                

                                                { (index === 0 && onWeb(window) ) && (
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
                                    <div key={index} className="code-wrapper reset">
                                        <div className="clipboard-content">
                                            <i onClick={async() => { 
                                            await handleClipboard(item.trim())}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                            </svg>
                                            </i>
                                        </div>
                                        <SyntaxHighlighter
                                            language={codeLanguage(item.split('\n')[0])}
                                            style={{ ...dark }}
                                            wrapLines={true} // Opcional: para que el código se ajuste a la línea
                                            customStyle={{fontSize: '15px', width: '100%', maxWidth: '800px', position: 'relative'}} // Opcional: para modificar el estilo
                                        >
                                            {item.trim().replace(item.split('\n')[0], '')}
                                        </SyntaxHighlighter>
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


  