export interface IModalComponent {
    type: 'primary' | 'secundary' | 'error'; 
    close: boolean ;
    setClose: (value: boolean) => void ;
    submitFuntion? : () => void;
}

export const ModalComponent = (props: IModalComponent): JSX.Element => {
    return (
    <>
    </>)
}