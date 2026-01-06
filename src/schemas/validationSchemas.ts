import * as yup from 'yup'

export const registrationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .test('min-length', 'Name must be at least 2 characters', (value) => !value || value.trim().length >= 2),
  address: yup
    .string()
    .required('Address is required')
    .test('min-length', 'Address must be at least 5 characters', (value) => !value || value.trim().length >= 5),
})

export const paymentSchema = yup.object({
  cardholderName: yup
    .string()
    .required('Cardholder name is required')
    .test('min-length', 'Cardholder name must be at least 2 characters', (value) => !value || value.trim().length >= 2)
    .test('letters-only', 'Cardholder name can only contain letters and spaces', (value) => !value || /^[a-zA-Z\s]+$/.test(value)),
  cardNumber: yup
    .string()
    .required('Card number is required')
    .test('validate-card', 'Card number can only contain digits', function(value) {
      if (!value) return true
      const cleaned = value.replace(/\s/g, '')
      return /^\d+$/.test(cleaned)
    })
    .test('card-length', 'Card number must be 16 digits', function(value) {
      if (!value) return true
      const cleaned = value.replace(/\s/g, '')
      return cleaned.length === 16
    }),
})

export type RegistrationFormData = yup.InferType<typeof registrationSchema>
export type PaymentFormData = yup.InferType<typeof paymentSchema>

export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\s/g, '')
  const groups = cleaned.match(/.{1,4}/g)
  return groups ? groups.join(' ') : cleaned
}
