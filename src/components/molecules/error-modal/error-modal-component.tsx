import './error-modal-component.css'

export interface IErrorModalComponentProps {
    message: string
    closeModal: () => void
}


export function ErrorModalComponent(props: IErrorModalComponentProps): JSX.Element {

    return (
      <div className='error-modal-component'>
        <div style={{position: 'absolute', zIndex: 2, top: '70px' }}>
              <img className='bg-img' src="/modal-feedback/snackbars.png" alt="Error modal" />
              <div className='modal-container-content'>
                <div className='modal-close-container'>
                  <img onClick={() => {
                    props.closeModal()
                  }}
                  style={{zIndex: 3}} 
                  src="/modal-feedback/close-icon.png" alt="Close Icon" />
                </div>
                <p className='header-modal-error'> ¡Lo siento!</p>
                <p className='txt-modal-error'>{props.message}</p>
                <p className='txt-modal-error'>Por favor intenta enviarmela de nuevo</p>
              </div>
            </div>
          </div>
    )
}