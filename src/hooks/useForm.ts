import { useState, useCallback } from 'react'
import * as yup from 'yup'

export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  schema: yup.AnyObjectSchema
) => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const validateField = useCallback(
    async (field: keyof T, value: any): Promise<string | null> => {
      try {
        await schema.validateAt(field as string, { [field]: value })
        return null
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          return error.message
        }
        return 'Validation error'
      }
    },
    [schema]
  )

  const handleChange = (field: keyof T, value: any) => {
    setValues((prev: T) => ({ ...prev, [field]: value }))
  }

  // The idea is validate with blur
  const handleBlur = async (field: keyof T) => {
    setTouched((prev: Partial<Record<keyof T, boolean>>) => ({ ...prev, [field]: true }))
    const error = await validateField(field, values[field])
    setErrors((prev: Partial<Record<keyof T, string>>) => ({ ...prev, [field]: error || undefined }))
  }

  const validateAll = async (): Promise<boolean> => {
    try {
      await schema.validate(values, { abortEarly: false })
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: Partial<Record<keyof T, string>> = {}
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path as keyof T] = err.message
          }
        })
        setErrors(newErrors)
        setTouched(
          Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
        )
      }
      return false
    }
  }

  const reset = (newValues?: T) => {
    setValues(newValues || initialValues)
    setErrors({})
    setTouched({})
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
  }
}
