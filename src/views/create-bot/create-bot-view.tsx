import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBot, type ICreateBotRequest } from '@/services/app-service';
import { SideBarComponent } from '@/components/organisms/side-bar/side-bar-component';
import { useUserStore } from '@/stores/user-store';
import { AnimatePresence, motion } from 'framer-motion';
import './create-bot-view.css';
import { HeaderComponent } from '@/components/organisms/header/header-component';

export function CreateBotView(): JSX.Element {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [theme, setTheme, userName] = useUserStore((store) => [
    store.theme,
    store.setTheme,
    store.name,
  ]);

  const [formData, setFormData] = useState<ICreateBotRequest>({
    name: '',
    description: '',
    context: '',
    gender_male: false,
    skills: ['search-web']
  });

  useEffect(() => {
    if (localStorage.getItem('theme') !== null) {
      setTheme(localStorage.getItem('theme') as string);
    }
  }, [setTheme]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSkillChange = (skill: string): void => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleGenerateRandomName = (): void => {
    setFormData(prev => ({
      ...prev,
      name: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (formData.name.trim().length === 0) {
        throw new Error('El nombre es requerido');
      }
      if (formData.description.trim().length === 0) {
        throw new Error('La descripción es requerida');
      }
      if (formData.context.trim().length === 0) {
        throw new Error('El contexto es requerido');
      }
      if (formData.skills.length === 0) {
        throw new Error('Selecciona al menos una habilidad');
      }

      const response = await createBot(formData);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message !== null ? errorData.message : 'Error al crear el bot');
      }

      const newBot = await response.json();
      console.log('Bot creado exitosamente:', newBot);
      
      navigate('/assistants');
    } catch (err: any) {
      setError(err.message || 'Error desconocido al crear el bot');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div data-theme={theme} className={'view bg-primary'}>
      <AnimatePresence>
        <motion.div style={{ width: '100%', height: '100%' }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className='flex'>
          <SideBarComponent userName={userName} />
          
          <main className='create-bot-main bg-base-100'>
            <HeaderComponent name={''} available={true} chatHeader={false} backbutton={true} />

            <section className='create-bot-content'>
              {(error === null) && <div className='create-bot-error'>{error}</div>}

              <div className='create-bot-form-wrapper'>
                <p className='create-bot-subtitle'>Diseña tu propio copiloto personalizado para ayudarte en tus estudios</p>

                <form onSubmit={handleSubmit} className='create-bot-form'>
                  {/* Nombre */}
                  <div className='form-group'>
                    <label htmlFor='name'>Nombre del agente</label>
                    <div className='name-input-group'>
                      <input
                        type='text'
                        id='name'
                        name='name'
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder='Nombre del agente'
                        disabled={isLoading}
                      />
                      <button
                        type='button'
                        className='btn-random'
                        onClick={handleGenerateRandomName}
                        disabled={isLoading}
                      >
                        Generar nombre
                      </button>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className='form-group'>
                    <label htmlFor='description'>Descripción</label>
                    <textarea
                      id='description'
                      name='description'
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder='Describe qué hace este agente...'
                      rows={4}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Contexto */}
                  <div className='form-group'>
                    <label htmlFor='context'>Contexto de operación</label>
                    <textarea
                      id='context'
                      name='context'
                      value={formData.context}
                      onChange={handleInputChange}
                      placeholder='Describe el entorno y limitaciones del agente...'
                      rows={4}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Género */}
                  <div className='form-group'>
                    <label>Género del agente</label>
                    <div className='gender-options'>
                      <label className='radio-label'>
                        <input
                          type='radio'
                          name='gender_male'
                          value='true'
                          checked={formData.gender_male === true}
                          onChange={() => setFormData(prev => ({ ...prev, gender_male: true }))}
                          disabled={isLoading}
                        />
                        Masculino
                      </label>
                      <label className='radio-label'>
                        <input
                          type='radio'
                          name='gender_male'
                          value='false'
                          checked={formData.gender_male === false}
                          onChange={() => setFormData(prev => ({ ...prev, gender_male: false }))}
                          disabled={isLoading}
                        />
                        Femenino
                      </label>
                    </div>
                  </div>

                  {/* Habilidades */}
                  <div className='form-group'>
                    <label>Habilidades</label>
                    <div className='skills-options'>
                      {['search-web', 'research', 'analysis', 'writing'].map(skill => (
                        <label key={skill} className='checkbox-label'>
                          <input
                            type='checkbox'
                            checked={formData.skills.includes(skill)}
                            onChange={() => handleSkillChange(skill)}
                            disabled={isLoading}
                          />
                          {skill === 'search-web' && 'Búsqueda en la web'}
                          {skill === 'research' && 'Investigación'}
                          {skill === 'analysis' && 'Análisis'}
                          {skill === 'writing' && 'Escritura'}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className='form-actions'>
                    <button
                      type='button'
                      className='btn btn-secondary'
                      onClick={() => navigate('/assistants')}
                      disabled={isLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      type='submit'
                      className='btn btn-primary'
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creando agente...' : 'Crear agente'}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </main>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
