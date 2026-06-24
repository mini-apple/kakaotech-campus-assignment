import Input from './Input'
import { type InputHTMLAttributes } from 'react'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
}

export default function FormField({ label, name, id, ...inputProps }: FormFieldProps) {
  const fieldId = id ?? name
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="text-[0.88rem] font-semibold text-[#555]">
        {label}
      </label>
      <Input id={fieldId} name={name} {...inputProps} />
    </div>
  )
}
