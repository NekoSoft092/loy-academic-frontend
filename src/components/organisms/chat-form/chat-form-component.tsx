import './chat-form-component.css'
import { useRef } from 'react'
import { useChatStore } from '@/stores/chat-store'
import { useAuthStore } from '@/stores/auth-store';

export function ChatFormComponent(): JSX.Element {

    const inputref = useRef<HTMLInputElement>(null);

    const [ userId ] = useAuthStore((store)=> [
      store.userId
    ])

    const [ addMessage, botSelected ] = useChatStore((state) => [
      state.addMessage,
      state.botSelected
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
        addMessage(message, userId, botSelected?.id ?? '');
        if(inputref.current !== null) {
          inputref.current.value = '';
        }
      }
    } 

    return (
        <div
        className='chat-form-component bg-base-100'
        as="MessageInput"
        > 
        <div
          style={{
            margin: 0,
            width: '100%',
            height: 'auto',
            boxSizing: 'border-box',
          }}
          className="textarea round fill"
        >

        <label className="input input-bordered flex items-center gap-2">
          <input type="text"
            ref={inputref}
            className="grow" 
            placeholder="Envia un mensaje a Elena..." 
            onKeyUp={(e) => {
              if(e.key === 'Enter' && !e.shiftKey) {
                handleSendMessage();
              }
            }}/>
          <button onClick={handleSendMessage} className="circle fill bg-base-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </label>
        </div>
      </div>
    )
}