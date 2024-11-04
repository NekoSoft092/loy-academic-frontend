import { forwardRef } from "react";

interface InputComponentProps {
    type?: string
    label?: string
    placeholder?: string
    error: boolean
    formHandle?: any
}

const InputComponent = forwardRef(
    ({ ...props }: InputComponentProps, ref) => {
      const fieldClassName = ['input', 'input-bordered', 'flex', 'items-center', 'gap-2']
      if (props.error) fieldClassName.push('input-secundary')
      return (
        <label className={fieldClassName.toString().replaceAll(',', ' ')} style={{outlineStyle: "none", width: '100%'}}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path
                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
                style={{
                    fontFamily: 'Open-Sans'
                }}
                ref={ref}
                autoComplete="off"
                placeholder={props.placeholder}
                type={props.type ?? 'texts'}
                {...props.formHandle}
            />
        </label>
      )
    }
  )
  
  InputComponent.displayName = 'AuthInput'
  
  export { InputComponent }