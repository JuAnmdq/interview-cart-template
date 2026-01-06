import React, { useEffect, useRef } from 'react'
import { Route, Switch, Redirect, useHistory, useLocation } from 'react-router-dom'
import { useCheckout } from 'context/CheckoutContext'
import ProductSelection from '../Products'
import Registration from '../Registration'
import Payment from '../Payment'
import Order from '../Order/Order'
import './Layout.css'

const STEPS = [
  { path: '/checkout/products', component: ProductSelection, title: 'Select Products' },
  { path: '/checkout/registration', component: Registration, title: 'Registration' },
  { path: '/checkout/payment', component: Payment, title: 'Payment' },
  { path: '/checkout/order', component: Order, title: 'Confirmation' },
]

const CheckoutLayout: React.FC = () => {
  const { state } = useCheckout()
  const history = useHistory()
  const location = useLocation()
  const hasRestoredStep = useRef(false)
  const currentStepIndex = STEPS.findIndex((step) => step.path === location.pathname)

  // it restore step from localStorage on mount
  useEffect(() => {
    if (!hasRestoredStep.current && state.currentStep > 0) {
      const savedStepPath = STEPS[state.currentStep]?.path
      if (savedStepPath && location.pathname !== savedStepPath) {
        history.replace(savedStepPath)
      }
      hasRestoredStep.current = true
    }
  }, [state.currentStep, history, location.pathname])

  const handleStepClick = (stepIndex: number, stepPath: string) => {
    // the idea is to allow navigation to any accessible step (not current, not future)
    if (stepIndex !== currentStepIndex && stepIndex <= state.currentStep) {
      history.push(stepPath)
    }
  }

  return (
    <div>
      <nav className="checkout-nav" aria-label="Checkout steps">
        <ol className="checkout-nav__steps">
          {STEPS.map((step, index) => {
            const isActive = location.pathname === step.path
            const isCompleted = index < currentStepIndex
            const isAccessible = index <= state.currentStep
            const isClickable = isAccessible && !isActive

            const stepClass = `checkout-nav__step ${
              isActive ? 'checkout-nav__step--active' : isCompleted ? 'checkout-nav__step--completed' : 'checkout-nav__step--pending'
            } ${isClickable ? 'checkout-nav__step--clickable' : ''}`

            return (
              <li
                key={step.path}
                className={stepClass}
                onClick={() => isClickable && handleStepClick(index, step.path)}
                aria-current={isActive ? 'step' : undefined}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={(e: React.KeyboardEvent<HTMLLIElement>) => {
                  if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    handleStepClick(index, step.path)
                  }
                }}
              >
                {step.title}
              </li>
            )
          })}
        </ol>
      </nav>

      <Switch>
        <Route exact path="/checkout/products" component={ProductSelection} />
        <Route exact path="/checkout/registration" component={Registration} />
        <Route exact path="/checkout/payment" component={Payment} />
        <Route exact path="/checkout/order" component={Order} />
        <Redirect from="/checkout" to="/checkout/products" />
      </Switch>
    </div>
  )
}

export default CheckoutLayout
