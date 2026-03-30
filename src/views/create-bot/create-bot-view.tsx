import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBot, type ICreateBotRequest } from '@/services/app-service';
import { getRandomBotName } from '@/lib/bot-names';
import { SideBarComponent } from '@/components/organisms/side-bar/side-bar-component';
import { useUserStore } from '@/stores/user-store';
import { AnimatePresence, motion } from 'framer-motion';
import './create-bot-view.css';

export function CreateBotView(): JSX.Element {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [theme, setTheme, userName, nextTheme] = useUserStore((store) => [
    store.theme,
    store.setTheme,
    store.name,
    store.nextTheme
  ]);

  const [formData, setFormData] = useState<ICreateBotRequest>({
    name: getRandomBotName(),
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleSkillChange = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleGenerateRandomName = () => {
    setFormData(prev => ({
      ...prev,
      name: getRandomBotName()
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.name.trim()) {
        throw new Error('El nombre es requerido');
      }
      if (!formData.description.trim()) {
        throw new Error('La descripción es requerida');
      }
      if (!formData.context.trim()) {
        throw new Error('El contexto es requerido');
      }
      if (formData.skills.length === 0) {
        throw new Error('Selecciona al menos una habilidad');
      }

      const response = await createBot(formData);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el bot');
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
            <header className='create-bot-header-container bg-base-200'>
              <div className='create-bot-header-content'>
                <h1>Crear nuevo agente de estudio</h1>
              </div>
              <div className='create-bot-theme-control'>
                <button
                  onClick={() => nextTheme()}
                  style={{ display: 'flex', gap: '5px' }}
                  className="theme-toggle-btn">
                  <p style={{ textTransform: 'capitalize' }}>{theme}</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                  </svg>
                </button>
              </div>
            </header>

            <section className='create-bot-content'>
              {error && <div className='create-bot-error'>{error}</div>}

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
