export interface Product {
  id: number
  name: string
}

export interface Cart {
  selectedProductId: number | null
}

export interface RegistrationData {
  name: string
  address: string
}

export interface PaymentData {
  cardholderName: string
  cardNumber: string
}

export interface WizardState {
  cart: Cart
  registration: RegistrationData | null
  payment: PaymentData | null
  currentStep: number
}

export interface PurchaseData {
  cart: Cart
  registration: RegistrationData
  payment: PaymentData
}
