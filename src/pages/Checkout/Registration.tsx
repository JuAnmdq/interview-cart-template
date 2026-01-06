import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useCheckout, CheckoutStep } from 'context/CheckoutContext'
import RegistrationForm from 'components/RegistrationForm/RegistrationForm'

const Registration: React.FC = () => {
  const history = useHistory()
  const { state, setRegistration, setStep } = useCheckout()

  // it redirects if no product selected
  useEffect(() => {
    if (state.cart.selectedProductId === null) {
      history.push('/checkout/products')
    }
  }, [state.cart.selectedProductId, history])

  const handleSubmit = (data: { name: string; address: string }) => {
    setRegistration({
      name: data.name,
      address: data.address,
    })
    setStep(CheckoutStep.PAYMENT)
    history.push('/checkout/payment')
  }

  const handleBack = () => {
    history.push('/checkout/products')
  }

  return (
    <div>
      <h2>Registration</h2>
      <RegistrationForm
        initialName={state.registration?.name || ''}
        initialAddress={state.registration?.address || ''}
        onSubmit={handleSubmit}
        onBack={handleBack}
      />
    </div>
  )
}

export default Registration
