/* eslint-disable @typescript-eslint/no-floating-promises */
import { SettingsNav } from '@/components/core/settings-nav';
import { motion, AnimatePresence } from 'framer-motion';
import { onWeb } from '@/lib/windows';
import { useAppStore } from '@/stores/app-store';
import { useEffect, useState } from 'react';
import { type IBot, useChatStore, type IPlugin } from '@/stores/chat-store';
import './dev-view.css';

export function DevView(): JSX.Element {

    const [ environment, setEnvironment ] = useAppStore((state)=> [
        state.environment, 
        state.setEnvironment
    ]);

    const [ bots, botName, setBotName ] = useChatStore((state)=> [
        state.bots, 
        state.botName, 
        state.setBotName, 
       
    ])

    const environments: string[]= ['production', 'staging', 'local'];
    const [ activeDropdown, setActiveDropDown ] = useState<boolean>(false);
    const [ activeDropdownBots, setActiveDropDownBots ] = useState<boolean>(false);
   
    useEffect(()=>{
    }, [environment]);

    return (
    <>
    <AnimatePresence>
        <motion.div
          style={{ width: '100%' }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}>
            <div className="flex flex-col reset" style={onWeb(window)?{ }: {marginTop: '0px'}}>
                <section className={onWeb(window)?'': 'sage-view'}>
                    <SettingsNav title='Dev tools'/>
                    <div className='container'>
                        <p>Escoge el entorno que deseas usar: </p>
                        <button className='reset-margin' style={{width: '80px'}} onClick={()=> {
                            if(activeDropdown) {
                                setActiveDropDown(false);
                            } else {
                                setActiveDropDown(true);
                            }
                        }}>
                            <span className='capitalize'>{environment}</span>
                            <i>arrow_drop_down</i>
                            <menu className={activeDropdown? 'active': ''} style={{width: '100%'}}>
                                {environments.map((item: string, index: number)=> {
                                    return (
                                        <a className='capitalized' style={{width: '100%'}} key={index} onClick={()=> {
                                            
                                            if(item === 'local') {
                                                setEnvironment('local');
                                            } else if(item=== 'staging') {
                                                setEnvironment('stg')
                                            } else {
                                                setEnvironment('prod')
                                            }
                                            setActiveDropDown(false);
                                            
                                        }}>{item}</a>
                                    )
                                })}
                            </menu>
                        </button>

                        <p>Elije con cual bot deseas hablar:</p>
                        { (bots.length > 0 )&& (
                        <button style={{width: 280}} className='reset-margin' onClick={()=> {
                            if(activeDropdownBots) {
                                setActiveDropDownBots(false);
                            } else {
                                setActiveDropDownBots(true);
                            }
                        }}>
                            <span>{botName}</span>
                            <i>arrow_drop_down</i>
                            
                            <menu className={ activeDropdownBots? 'active': '' }>
                                    { bots.map((item: IBot, index: number)=> {
                                        return (
                                        <a key={index} onClick={()=>{
                                            setBotName(item.name);
                                            setActiveDropDownBots(false);
                                        }}>
                                            <h6>{item.name}</h6>
                                            <p className='capitalized'>{item.description}</p>
                                            <nav className="scroll hide-scroll">
                                                {item.plugins.map((plugin: IPlugin, indexPlugin: number)=>{
                                                    return (<a key={indexPlugin} className='chip'>{plugin.name}</a>)
                                                })}
                                                
                                            </nav>
                                            
                                        </a>
                                        )
                                    })}   
                            </menu>  
                        </button>
                        )}
                        { bots.length === 0 && (
                            <div>
                                <p>No estas conectado al entorno: {environment}</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </motion.div>
    </AnimatePresence>
    </>)
}