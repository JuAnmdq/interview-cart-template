import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { WizardState, RegistrationData, PaymentData } from '../types'

const STORAGE_KEY = 'checkout_wizard_state'

export const enum CheckoutStep {
  PRODUCT = 0,
  REGISTRATION = 1,
  PAYMENT = 2,
  CONFIRMATION = 3,
}

type CheckoutAction =
  | { type: 'SELECT_PRODUCT'; payload: { productId: number } }
  | { type: 'SET_REGISTRATION'; payload: RegistrationData }
  | { type: 'SET_PAYMENT'; payload: PaymentData }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'RESET_WIZARD' }
  | { type: 'HYDRATE_STATE'; payload: WizardState };

const initialState: WizardState = {
  cart: {
    selectedProductId: null
  },
  registration: null,
  payment: null,
  currentStep: CheckoutStep.PRODUCT,
}

const checkoutReducer = (state: WizardState, action: CheckoutAction): WizardState => {
  switch (action.type) {
    case 'SELECT_PRODUCT': {
      return {
        ...state,
        cart: {
          selectedProductId: action.payload.productId,
        },
      }
    }

    case 'SET_REGISTRATION': {
      return {
        ...state,
        registration: action.payload,
      }
    }

    case 'SET_PAYMENT': {
      return {
        ...state,
        payment: action.payload,
      }
    }

    case 'SET_STEP': {
      return {
        ...state,
        currentStep: action.payload,
      }
    }

    case 'RESET_WIZARD': {
      return initialState
    }

    case 'HYDRATE_STATE': {
      return action.payload
    }

    default:
      return state
  }
}

interface CheckoutContextType {
  state: WizardState;
  selectProduct: (productId: number) => void;
  setRegistration: (data: RegistrationData) => void;
  setPayment: (data: PaymentData) => void;
  setStep: (step: number) => void;
  resetWizard: () => void;
  canProceedToStep: (step: number) => boolean;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(checkoutReducer, initialState)

  // the idea is to load state from localStorage when open the page
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as WizardState
        dispatch({ type: 'HYDRATE_STATE', payload: parsed })
      } catch (error) {
        console.error('Failed to parse stored state:', error)
      }
    }
  }, [])

  // for every change the idea is to update localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const selectProduct = (productId: number) => {
    dispatch({ type: 'SELECT_PRODUCT', payload: { productId } })
  }

  const setRegistration = (data: RegistrationData) => {
    dispatch({ type: 'SET_REGISTRATION', payload: data })
  }

  const setPayment = (data: PaymentData) => {
    dispatch({ type: 'SET_PAYMENT', payload: data })
  }

  const setStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step })
  }

  const resetWizard = () => {
    dispatch({ type: 'RESET_WIZARD' })
    localStorage.removeItem(STORAGE_KEY)
  }

  // this validates if is possible to enter to a specific step
  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case CheckoutStep.PRODUCT:
        return true
      case CheckoutStep.REGISTRATION:
        return state.cart.selectedProductId !== null
      case CheckoutStep.PAYMENT:
        return !!(state.registration?.name && state.registration?.address)
      case CheckoutStep.CONFIRMATION:
        return !!(state.payment?.cardholderName && state.payment.cardNumber)
      default:
        return false
    }
  }

  const value: CheckoutContextType = {
    state,
    selectProduct,
    setRegistration,
    setPayment,
    setStep,
    resetWizard,
    canProceedToStep,
  }

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
}

export const useCheckout = (): CheckoutContextType => {
  const context = useContext(CheckoutContext)
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider')
  }
  return context
}
