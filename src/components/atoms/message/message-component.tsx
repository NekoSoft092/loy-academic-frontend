import { useChatStore, type IMessage } from "@/stores/chat-store";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark as dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './message-component.css';
import { onWeb } from "@/lib/windows";
import { ArticleReferences } from "@/components/templates/article-references";
import { useEffect, useState } from "react";
import { LOY_LOCAL_API } from "@/lib/urls";
import { generateVoice } from "@/services/chat-service";

// Class to represent a processed message
export interface IMessageProcessed {
    index: number;
    type: 'text' | 'code' | 'title' | 'subtitle';
    content: string;
}

class MessageProcessed implements IMessageProcessed{
    index: number;
    type: 'text' | 'code' | 'title' | 'subtitle';
    content: string;
    constructor(index: number, type: 'text' | 'code' | 'title' | 'subtitle', content: string) {
        this.index = index;
        this.type = type;
        this.content = content;
    }
}

// Class to parse a message and store all processed parts in a list
class MessageParser {
    processedMessages: MessageProcessed[];

    constructor(text: string) {
        this.processedMessages = [];
        this.parse(text);
    }

    private parse(text: string): void {
        // Split by code blocks
        const parts = text.split('```');
        let idx = 0;
        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                const lines = parts[i].split('\n');
                for (const line of lines) {
                    if (line.startsWith('**') && (line.includes('Title:' ) || line.includes('Título:'))) {
                        this.processedMessages.push(new MessageProcessed(idx++, 'title', this.processTitle(line)));
                    } 
                    else if (line.startsWith('**')) {
                        this.processedMessages.push(new MessageProcessed(idx++, 'subtitle', this.processTitle(line)));
                    }
                    else if (line.startsWith('####')) {
                        this.processedMessages.push(new MessageProcessed(idx++, 'subtitle', this.processTitle(line)));
                    } else if (line.startsWith('###')) {
                        this.processedMessages.push(new MessageProcessed(idx++, 'title', this.processTitle(line)));
                    } else if (line.trim() !== '') {
                        this.processedMessages.push(new MessageProcessed(idx++, 'text', line));
                    }
                }
            } else {
                // Code block
                this.processedMessages.push(new MessageProcessed(idx++, 'code', parts[i]));
            }
        }
    }

    private processTitle(text: string): string {
        // Remove leading ### and all asterisks from the text
        if (text.includes('Title:') || text.includes('Título:')) {
            text = text.replace(/Title:|Título:/, '').trim();
        }
        return text.replace(/^#+/, '').replace(/\*/g, '').trim();
    }
}

export function MessageComponent(props: IMessage): JSX.Element {
    const messageSplit: string[] = props.message.split('```');

    const [botSelected] = useChatStore((state) => [
        state.botSelected
    ]);
    const [messageParse, setMessageParse] = useState<MessageParser>(new MessageParser(props.message));

    const handleClipboard = async (text: string): Promise<void> => {
        await navigator.clipboard.writeText(text);
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

    const isTitle = (message: string): boolean => {
        return (message.substring(0,3) === '###') 
    }

    useEffect(() => {
        setMessageParse(new MessageParser(props.message))
    }, [props.message]);

    return (
        <>
        <div className={props.direction === 'incoming' ? "cs-message cs-message--incoming cs-message--single message-component bg-base-300 pl-4 pr-4": "cs-message cs-message--outgoing cs-message--single message-component bg-base-300 pl-4 pr-4 rounded-md"}
            style={{borderRadius: '5px'}}>

            { (props.direction==='incoming') && (
            <div className="flex justify-center items-start pt-2">
                <div className="cs-avatar cs-avatar--md reset">
                    <img src={ botSelected !== null ? `${LOY_LOCAL_API}/bots/${botSelected.id}/image` : "/assistants/elena-ia-assistant.svg"} 
                        alt={botSelected !== null ? botSelected.name : "Assistant"} />
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
                                                {(index === 0 && (
                                                    <i onClick={async(e) => {
                                                        e.preventDefault();
                                                        await generateVoice(item.trim())
                                                    }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                                                        </svg>

                                                    </i>
                                                ))}
                                                
                                                { (index === 0 && onWeb(window) ) && (
                                                    <i>
                                                        <ArticleReferences
                                                            messages={messageParse.processedMessages}
                                                            references={[]}
                                                            articleName={'Article'}/>
                                                    </i>
                                                )}
                                               </div>
                                            </div>
                                        )}
                                        { props.direction === 'incoming' && (
                                            item.split('\n').map((item: string, index_: number) => {

                                                if(isTitle(item)) {
                                                    return (
                                                        <p key={index_} style={{fontWeight: 'bold', fontSize: '60', marginBottom: 30}} className={index === 0 ?"txt-message": "txt-message ma"}>{item.replace('###', '')}</p>
                                                    )
                                                } else {
                                                    return (
                                                    <p key={index_} style={{marginBottom: 20}} className={index === 0 ?"txt-message": "txt-message ma"}>{item}</p>
                                                )
                                            }
                                            }
                                        ))}

                                        { props.direction === 'outgoing' && (
                                            <p style={{}} className={index === 0 ?"txt-message": "txt-message ma"}>{item}</p>
                                        )}
                                        
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


