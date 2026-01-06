import { FormEvent } from 'react'
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
      <div>
        <label htmlFor='cardholder-name'>Cardholder Name</label>
        <br />
        <input
          id='cardholder-name'
          type='text'
          name='name'
          value={values.cardholderName}
          onChange={(e) => handleChange('cardholderName', e.target.value)}
          onBlur={() => handleBlur('cardholderName')}
        />
        {touched.cardholderName && errors.cardholderName && (
          <div className="payment-form__error">{errors.cardholderName}</div>
        )}
      </div>

      <div>
        <label htmlFor='card-number'>Credit Card Number</label>
        <br />
        <input
          id='card-number'
          type='text'
          name='card'
          value={values.cardNumber}
          onChange={(e) => handleChange('cardNumber', e.target.value)}
          onBlur={() => handleBlur('cardNumber')}
        />
        {touched.cardNumber && errors.cardNumber && (
          <div className="payment-form__error">{errors.cardNumber}</div>
        )}
      </div>

      <hr />

      <button type='button' onClick={onBack}>Back</button>
      <button type='submit'>Next</button>
    </form>
  )
}


export default PaymentForm
