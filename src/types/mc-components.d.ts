declare module 'mc-components' {
  import { ComponentType, ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

  export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'primary' | 'secondary' | 'danger' | 'size' | 'loading'> {
    primary?: boolean
    secondary?: boolean
    danger?: boolean
    size?: 'small' | 'medium' | 'large'
    loading?: boolean
  }

  export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    size?: 'small' | 'medium' | 'large'
    error?: boolean
  }

  export interface InputFieldProps {
    label?: string
    input?: {
      id?: string
      name?: string
      type?: string
      value?: string
      onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
      onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
      disabled?: boolean
    }
    meta?: {
      error?: string
      success?: string
      touched?: boolean
    }
    error?: string
    touched?: boolean
    placeholder?: string
  }

  export interface TextareaFieldProps {
    label?: string
    input?: {
      id?: string
      name?: string
      value?: string
      onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
      onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
      disabled?: boolean
    }
    meta?: {
      error?: string
      success?: string
      touched?: boolean
    }
    error?: string
    touched?: boolean
    placeholder?: string
    rows?: number
  }

  export const Button: ComponentType<ButtonProps>
  export const Input: ComponentType<InputProps>
  export const InputField: ComponentType<InputFieldProps>
  export const TextareaField: ComponentType<TextareaFieldProps>
}
