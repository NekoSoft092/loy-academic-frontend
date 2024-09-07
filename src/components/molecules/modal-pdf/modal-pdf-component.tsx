import { useState, useRef, useEffect } from "react";
import { StyleSheet, Page, Document, View, Text, PDFDownloadLink, Image } from '@react-pdf/renderer';
import './modal-pdf-component.css';
import { useChatStore } from "@/stores/chat-store";

export const ModalPDFComponent = (): JSX.Element => {

    const [ generatedPDFMessage, setGeneratedPDFMessage ] = useChatStore((state)=> [
        state.generatedPDFMessage, 
        state.setGeneratedPDFMessage
    ]);

    const inputref = useRef<HTMLInputElement>(null);

    const [ fileName, setFileName ] =useState<string>('archive');

    const styles = StyleSheet.create({
        page: { flexDirection: 'row', backgroundColor: '#fff' },
        section: { margin: 30, padding: 30 },
        text: { fontSize: 12, marginBottom: 10 }, 
        headerText: { }, 
        bold: { fontWeight: 'bold'}, 
        header: {flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30}, 
        textSmall: {fontSize: 10, marginTop: 6}
    });

    const MyDocument = (): JSX.Element => (
        <Document>
        <Page size="A4" style={styles.page}>
        { (generatedPDFMessage !== null) && (
            <View style={styles.section}>
            
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.headerText, styles.bold]} >Mensaje enviado por Sage</Text>
                        <Text style={[styles.text, styles.textSmall ]}>{new Date(generatedPDFMessage.sentTime).toString()}</Text>
                    </View>
                        
                    <Image style={{height: 50}} src="https://www.wizzysage.com/assets/images/icons/sage_logo.png" />
                </View>
                
                <Text style={styles.text}>{generatedPDFMessage.message}</Text>
            
            </View>
            )}
        </Page>
        </Document>
    );

    useEffect(()=> {}, [
        generatedPDFMessage
    ])

    return (
    <>
    <div className='modal-section'>
        <dialog className={(generatedPDFMessage !== null)? 'modal active': 'modal'}>
            <h5>Descargar PDF</h5>

            <div className="field label border">
            <input type="text" ref={inputref} />
            <label>Nombre del archivo (.pdf) </label>
            </div>
            <div className="flex-row-space-between">
            <button className="border" onClick={() => {
                setGeneratedPDFMessage(null);
                
            }}>Cancelar</button>
                
                <div onClick={()=>{
                    if(inputref.current !== null && inputref.current.value.length > 0) {
                        setFileName(inputref.current.value);
                      }
                  
                }}>
                    <PDFDownloadLink document={<MyDocument />} fileName={`${fileName}.pdf`}>
                        {({ blob, url, loading, error }) => (loading ? 'Cargando ...' : (<button onClick={() => {
                            setGeneratedPDFMessage(null);
                            setFileName('');

                        }}>Descargar</button>))}
                        
                    </PDFDownloadLink>
                </div>
                
                    
               
            </div>
        </dialog>
    </div>
    </>)
}