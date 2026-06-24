import { type InputHTMLAttributes } from 'react'

interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
}

export default function CheckboxField({ label, name, id, ...inputProps }: CheckboxFieldProps) {
  const fieldId = id ?? name
  return (
    <div className="flex items-center gap-3 px-1">
      <input
        id={fieldId}
        name={name}
        type="checkbox"
        className="w-4 h-4 accent-primary cursor-pointer"
        {...inputProps}
      />
      <label htmlFor={fieldId} className="text-[0.95rem] text-[#1a1a2e] cursor-pointer">
        {label}
      </label>
    </div>
  )
}
