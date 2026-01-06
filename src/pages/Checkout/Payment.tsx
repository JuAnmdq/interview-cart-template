import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useCheckout, CheckoutStep } from 'context/CheckoutContext'
import PaymentForm from 'components/PaymentForm/PaymentForm'

const Payment: React.FC = () => {
  const history = useHistory()
  const { state, setPayment, setStep } = useCheckout()

  // this redirects if previous steps not completed
  useEffect(() => {
    if (state.cart.selectedProductId === null) {
      history.push('/checkout/products')
    } else if (!state.registration) {
      history.push('/checkout/registration')
    }
  }, [state.cart.selectedProductId, state.registration?.name, state.registration?.address, history])

  const handleSubmit = (data: { cardholderName: string; cardNumber: string }) => {
    setPayment({
      cardholderName: data.cardholderName,
      cardNumber: data.cardNumber,
    })
    setStep(CheckoutStep.CONFIRMATION)
    history.push('/checkout/order')
  }

  const handleBack = () => {
    history.push('/checkout/registration')
  }

  return (
    <div>
      <h2>Payment Information</h2>
      <PaymentForm
        initialCardholderName={state.payment?.cardholderName || ''}
        initialCardNumber={state.payment?.cardNumber || ''}
        onSubmit={handleSubmit}
        onBack={handleBack}
      />
    </div>
  )
}

export default Payment
