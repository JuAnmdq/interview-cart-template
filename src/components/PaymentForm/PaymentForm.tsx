import { FormEvent } from 'react'
import { Button, InputField } from 'mc-components'
import { useForm } from 'hooks/useForm'
import { paymentSchema } from 'schemas/validationSchemas'
import './PaymentForm.css'

interface PaymentFormProps {
  initialCardholderName?: string;
  initialCardNumber?: string;
  onSubmit: (data: { cardholderName: string; cardNumber: string }) => void;
  onBack: () => void;
}

const PaymentForm = ({
  initialCardholderName = '',
  initialCardNumber = '',
  onSubmit,
  onBack
}: PaymentFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, validateAll } = useForm({
    cardholderName: initialCardholderName, cardNumber: initialCardNumber
  }, paymentSchema)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValid = await validateAll()
    if (isValid) {
      onSubmit({ cardholderName: values.cardholderName || '', cardNumber: values.cardNumber || '' })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label='Cardholder Name'
        input={{
          id: 'cardholder-name',
          type: 'text',
          name: 'cardholder-name',
          value: values.cardholderName,
          onChange: (e) => handleChange('cardholderName', e.target.value),
          onBlur: () => handleBlur('cardholderName')
        }}
        meta={{
          error: errors.cardholderName,
          touched: touched.cardholderName
        }}
      />

      <InputField
        label='Credit Card Number'
        input={{
          id: 'card-number',
          type: 'text',
          name: 'card-number',
          value: values.cardNumber,
          onChange: (e) => handleChange('cardNumber', e.target.value),
          onBlur: () => handleBlur('cardNumber')
        }}
        meta={{
          error: errors.cardNumber,
          touched: touched.cardNumber
        }}
      />

      <hr />

      <div className="payment-form__actions">
        <Button type='button' onClick={onBack}>Back</Button>
        <Button type='submit' primary>Next</Button>
      </div>
    </form>
  )
}


export default PaymentForm
