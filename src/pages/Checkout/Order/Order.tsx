import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { makePurchase } from 'api'
import { useCheckout } from 'context/CheckoutContext'
import OrderConfirmation from 'components/OrderConfirmation/OrderConfirmation'
import './Order.css'

const Order: React.FC = () => {
  const history = useHistory()
  const { state, resetWizard } = useCheckout()
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // the idea is redirect if previous steps not completed
  useEffect(() => {
    if (isSuccess) {
      resetWizard()
    } else {
      if (state.cart.selectedProductId === null) {
        history.push('/checkout/products')
      } else if (!state.registration?.name || !state.registration?.address) {
        history.push('/checkout/registration')
      } else if (!state.payment?.cardholderName || !state.payment?.cardNumber) {
        history.push('/checkout/payment')
      }
    }
  }, [
    state.cart.selectedProductId,
    state.registration?.name, state.registration?.address,
    state.payment?.cardholderName,
    state.payment?.cardNumber,
    history,
    isSuccess
  ])

  const handleConfirm = async () => {
    if (!state.registration || !state.payment) {
      return
    }

    try {
      setIsPending(true)
      setError(null)
      await makePurchase()
      setIsSuccess(true)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsPending(false)
    }
  }

  const handleBack = () => {
    history.push('/checkout/payment')
  }

  if (isSuccess) {
    return <OrderConfirmation />
  }

  return (
    <div>
      <h2>Order Confirmation</h2>

      <section className="order__section" aria-labelledby="cart-summary">
        <h3 id="cart-summary">Selected Product</h3>
        <p>
          <strong>Product ID:</strong> {state.cart.selectedProductId}
        </p>
      </section>

      <section className="order__section" aria-labelledby="registration-info">
        <h3 id="registration-info">Registration Information</h3>
        <p>
          <strong>Name:</strong> {state.registration?.name}
        </p>
        <p>
          <strong>Address:</strong> {state.registration?.address}
        </p>
      </section>

      <section className="order__section" aria-labelledby="payment-info">
        <h3 id="payment-info">Payment Information</h3>
        <p>
          <strong>Cardholder:</strong> {state.payment?.cardholderName}
        </p>
        <p>
          <strong>Card Number:</strong> **** **** ****{' '}
          {state.payment?.cardNumber?.replace(/\s/g, '').slice(-4)}
        </p>
      </section>

      {error && (
        <div role="alert" className="order__error">
          <strong>Error:</strong> {error.message}
        </div>
      )}

      <hr />

      <div className="order__actions">
        <button type="button" onClick={handleBack} disabled={isPending}>
          Back
        </button>
        <button onClick={handleConfirm} disabled={isPending}>
          {isPending ? 'Processing...' : 'Confirm Purchase'}
        </button>
      </div>
    </div>
  )
}

export default Order
