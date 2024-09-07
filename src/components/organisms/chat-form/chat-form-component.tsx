import './chat-form-component.css'
import TextareaAutosize from 'react-textarea-autosize'
import { useRef } from 'react'
import { useChatStore } from '@/stores/chat-store'


export function ChatFormComponent(): JSX.Element {

    const inputref = useRef<HTMLTextAreaElement>(null);

    const [ addMessage ] = useChatStore((state) => [
      state.addMessage
    ]);

    const handleSendMessage = (): void => {
      const message: string = inputref.current?.value ?? '';
      let onlyEnter: boolean = false;
      let onlySpace: boolean = false;
      let counterEnter: number = 0;
      let counterSpace: number = 0;

      let i: number;
      for(i = 0; i < message.length; i++) {
        if(message[i] === String.fromCharCode(10)) {
          counterEnter ++;
        }
        if(message[i] === ' ') {
          counterSpace ++;
        }
      }
      if(message.length === counterEnter) {
        onlyEnter = true;
      }
      if(message.length === counterSpace) {
        onlySpace = true;
      }

      // De Morgan 
      if(!onlyEnter && !onlySpace && !((counterEnter + counterSpace) === message.length) && message.length > 3) {
        addMessage(message);
        if(inputref.current !== null) {
          inputref.current.value = '';
        }
      }
    } 

    return (
        <div
        className='chat-form-component'
        as="MessageInput"
        > 
        <div
          style={{
            margin: 0,
            width: '100%',
            height: 'auto',
            maxHeight: '140px',
            boxSizing: 'border-box',
          }}
          className="textarea round fill"
        >
          <TextareaAutosize
            ref={inputref}
            className="chat-textarea"
            rows={1}
            style={{
              overflowY: 'hidden',
              height: 32,
            }}
            placeholder="Ingresa tu mensaje aquí"
            onKeyUp={(e) => {
              if(e.key === 'Enter' && !e.shiftKey) {
                handleSendMessage();
              }
            }}
          />
        </div>

        <button onClick={handleSendMessage} className="circle fill">
          <i>send</i>
        </button>
      </div>
    )
}