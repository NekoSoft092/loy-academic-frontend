import { forwardRef } from 'react'
interface AuthInputProps {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  suffixOnClick?: () => void
  type?: string
  label?: string
  placeholder?: string
  errorMessage?: string
  formHandle?: any
}

const AuthInput = forwardRef(
  ({ prefix, suffix, ...props }: AuthInputProps, ref) => {
    const fieldClassName = ['field', 'label', 'fill', 'border', 'reset']
    if (prefix != null) fieldClassName.push('prefix')
    if (suffix != null) fieldClassName.push('suffix')
    if (props.errorMessage != null) fieldClassName.push('invalid')
    return (
      <div className={fieldClassName.join(' ')}>
        {prefix ?? null}
        <input
          style={{
            fontFamily: 'Open-Sans'
          }}
          ref={ref}
          autoComplete="off"
          type={props.type ?? 'texts'}
          {...props.formHandle}
        />
        <label>{props.placeholder}</label>
        {props.errorMessage != null && (
          <span className="error">{props.errorMessage}</span>
        )}
        {suffix ?? null}
      </div>
    )
  }
)

AuthInput.displayName = 'AuthInput'

export { AuthInput }
