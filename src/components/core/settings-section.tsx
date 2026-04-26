import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SettingSection, SettingOption } from '@/lib/settings';
import { SettingsOption } from './settings-list';

interface SettingsSectionProps {
  section: SettingSection
  onToggleSetting: (id: string) => void
  onSelectValue?: (id: string, value: string) => void
}

export function SettingsSection({ section, onToggleSetting, onSelectValue }: SettingsSectionProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="settings-section mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-4 bg-base-200 hover:bg-base-300 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{section.icon}</span>
          <div className="text-left">
            <h5 className="text-lg font-semibold text-base-content">
              {section.title}
            </h5>
            {section.description && (
              <p className="text-sm text-base-content text-opacity-60">
                {section.description}
              </p>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-base-content"
        >
          ▼
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ul className="divide-y divide-gray-300 bg-base-100 rounded-b-lg">
              {section.settings.map((setting) => (
                <SettingsOption
                  key={setting.id}
                  id={setting.id}
                  title={setting.name}
                  status={setting.enabled}
                  description={setting.description}
                  type={setting.type}
                  options={setting.options}
                  toggle={() => onToggleSetting(setting.id)}
                  onSelectValue={(value) => onSelectValue?.(setting.id, value)}
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
