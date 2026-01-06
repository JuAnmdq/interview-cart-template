import React from 'react'
import { Link } from 'react-router-dom'
import './OrderConfirmation.css'

const OrderConfirmation: React.FC = () => {
  return (
    <div className="order-confirmation">
      <div className="order-confirmation__content">
        <h3>Congrats!</h3>
        <p>You've successfully purchased a MasterClass account.</p>
        <div className="order-confirmation__actions">
          <Link
            to="/checkout/products"
            className="order-confirmation__link"
          >
            Start New Purchase
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
