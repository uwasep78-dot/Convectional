import { useState, useCallback } from 'react'

export function useFormField(initialValue = '', validator) {
  const [value, setValue] = useState(initialValue)
  const [touched, setTouched] = useState(false)
  const [error, setError] = useState('')
  const blur = useCallback(() => setTouched(true), [])
  const validate = useCallback(() => {
    if (!validator) { setError(''); return true }
    const err = validator(value)
    setError(err || '')
    return !err
  }, [value, validator])
  const reset = useCallback(() => { setValue(initialValue); setTouched(false); setError('') }, [initialValue])
  return {
    value,
    setValue,
    touched,
    error,
    hasError: touched && !!error,
    blur,
    validate,
    reset,
    bind: {
      value,
      onChange: (e) => setValue(e.target.value),
      onBlur: blur,
      onFocus: () => setTouched(true),
    },
  }
}

export function FormField({ id, label, type = 'text', value, onChange, error, required = false, placeholder, helper, disabled }) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}{required && <span className="form-required" aria-label="required"> *</span>}
      </label>
      <input
        id={id}
        className={`form-input ${error ? 'error' : ''}`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-required={required}
      />
      {error && <p className="form-error" role="alert">{error}</p>}
      {helper && !error && <p className="form-helper">{helper}</p>}
    </div>
  )
}
