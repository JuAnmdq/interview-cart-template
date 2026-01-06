import { FormEvent } from 'react'
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
      <div>
        <label htmlFor='name'>Name</label>
        <br />
        <input
          id='name'
          type='text'
          name='name'
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
        />
        {touched.name && errors.name && (
          <div className="registration-form__error">{errors.name}</div>
        )}
      </div>

      <div>
        <label htmlFor='address'>Street Address</label>
        <br />
        <textarea
          id='address'
          name='address'
          value={values.address}
          onChange={(e) => handleChange('address', e.target.value)}
          onBlur={() => handleBlur('address')}
        />
        {touched.address && errors.address && (
          <div className="registration-form__error">{errors.address}</div>
        )}
      </div>

      <hr />

      <button type='button' onClick={onBack}>Back</button>
      <button type='submit'>Next</button>
    </form>
  )
}


export default RegistrationForm
