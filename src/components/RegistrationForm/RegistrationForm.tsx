import { FormEvent } from 'react'
import { Button, InputField, TextareaField } from 'mc-components'
import { useForm } from 'hooks/useForm'
import { registrationSchema } from 'schemas/validationSchemas'
import './RegistrationForm.css'

interface RegistrationFormProps {
  initialName?: string;
  initialAddress?: string;
  onSubmit: (data: { name: string; address: string }) => void;
  onBack: () => void;
}

const RegistrationForm = ({
  initialName = '',
  initialAddress = '',
  onSubmit,
  onBack
}: RegistrationFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, validateAll } = useForm(
    { name: initialName, address: initialAddress },
    registrationSchema
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValid = await validateAll()
    if (isValid) {
      onSubmit({ name: values.name || '', address: values.address || '' })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label='Name'
        input={{
          id: 'name',
          type: 'text',
          name: 'name',
          value: values.name,
          onChange: (e) => handleChange('name', e.target.value),
          onBlur: () => handleBlur('name')
        }}
        meta={{
          error: errors.name,
          touched: touched.name
        }}
      />

      <TextareaField
        label='Street Address'
        input={{
          id: 'address',
          name: 'address',
          value: values.address,
          onChange: (e) => handleChange('address', e.target.value),
          onBlur: () => handleBlur('address')
        }}
        meta={{
          error: errors.address,
          touched: touched.address
        }}
      />

      <hr />

      <div className="registration-form__actions">
        <Button type='button' onClick={onBack}>Back</Button>
        <Button type='submit' primary>Next</Button>
      </div>
    </form>
  )
}


export default RegistrationForm
