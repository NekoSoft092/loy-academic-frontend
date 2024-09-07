import { AuthHeader } from './shared/auth-header'
import { AuthInput } from './shared/auth-input'
import { motion, AnimatePresence } from 'framer-motion'
import { ServerIcon, ServerStackIcon } from '@heroicons/react/24/solid'

interface DevModeFormProps {
  isDevMode: boolean
}

export function DevModeForm(props: DevModeFormProps): JSX.Element {
  return (
    <AnimatePresence>
      {props.isDevMode && (
        <motion.div
          style={{ width: '100%' }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          <div style={{ width: '100%' }}>
            <AuthHeader isLogin={false} isDevMode={true} />
            <form
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <AuthInput
                type="text"
                placeholder="Server ip"
                prefix={<ServerStackIcon />}
              />
              <AuthInput
                type="number"
                placeholder="Port"
                prefix={<ServerIcon />}
              />

              <label className="checkbox">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <button
                style={{
                  width: '100%',
                  boxSizing: 'inherit',
                  marginTop: '1.4rem',
                }}
              >
                Sign in
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
