import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import App from '../App'
import * as api from '../api'

jest.mock('../api')

const mockedGetProducts = api.getProducts as jest.MockedFunction<typeof api.getProducts>
const mockedMakePurchase = api.makePurchase as jest.MockedFunction<typeof api.makePurchase>

describe('Purchase Flow - Failure', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()

    mockedGetProducts.mockResolvedValue([
      { id: 1, name: 'First Product' },
      { id: 2, name: 'Second Product' },
    ])
  })

  it('should show error when products fail to load', async () => {
    mockedGetProducts.mockRejectedValue(new Error('Failed to fetch products'))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/error loading products/i)).toBeInTheDocument()
    })
  })

  it('should prevent proceeding without items in cart', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('First Product')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled()
  })

  it('should validate registration form fields', async () => {
    render(<App />)

    // the idea is to select a product and navigate to registration
    await waitFor(() => {
      expect(screen.getByText('First Product')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Select First Product'))
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /registration/i })).toBeInTheDocument()
    })

    // then clear form and try to submit to test errors
    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    const addressInput = screen.getByLabelText(/street address/i) as HTMLTextAreaElement

    fireEvent.change(nameInput, { target: { value: '' } })
    fireEvent.change(addressInput, { target: { value: '' } })

    fireEvent.click(screen.getByRole('button', { name: /next/i }))

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/address is required/i)).toBeInTheDocument()
    })

    expect(screen.getByRole('heading', { name: /registration/i })).toBeInTheDocument()
  })

  it('should validate name with minimum length', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('First Product')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Select First Product'))
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /registration/i })).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText(/name/i)
    fireEvent.change(nameInput, { target: { value: 'A' } })
    fireEvent.blur(nameInput)

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
    })
  })

  it('should validate payment form fields', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('First Product')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Select First Product'))
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /registration/i })).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/street address/i), { target: { value: '123 Main St' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /payment information/i })).toBeInTheDocument()
    })

    // if user tries to submit empty form
    fireEvent.click(screen.getByRole('button', { name: /next/i }))

    await waitFor(() => {
      expect(screen.getByText(/cardholder name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/card number is required/i)).toBeInTheDocument()
    })
  })

  it('should validate invalid card number length', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('First Product')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Select First Product'))
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /registration/i })).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/street address/i), { target: { value: '123 Main St' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /payment information/i })).toBeInTheDocument()
    })

    // if enter card number with invalid length (less than 16 digits)
    const cardNumberInput = screen.getByLabelText(/credit card number/i)
    fireEvent.change(cardNumberInput, { target: { value: '123456789012' } })
    fireEvent.blur(cardNumberInput)

    await waitFor(() => {
      expect(screen.getByText(/card number must be 16 digits/i)).toBeInTheDocument()
    })
  })

  it('should handle purchase API failure', async () => {
    mockedMakePurchase.mockRejectedValue(new Error('Payment processing failed'))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('First Product')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Select First Product'))
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /registration/i })).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/street address/i), { target: { value: '123 Main St' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /payment information/i })).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText(/cardholder name/i), { target: { value: 'JOHN DOE' } })
    fireEvent.change(screen.getByLabelText(/credit card number/i), { target: { value: '4242424242424242' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /order confirmation/i })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /confirm purchase/i }))

    // Should show error message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/payment processing failed/i)).toBeInTheDocument()
    })

    // Should still be on confirmation page
    expect(screen.getByRole('heading', { name: /order confirmation/i })).toBeInTheDocument()
  })

  it('should validate cardholder name contains only letters', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('First Product')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Select First Product'))
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /registration/i })).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/street address/i), { target: { value: '123 Main St' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /payment information/i })).toBeInTheDocument()
    })

    const cardholderInput = screen.getByLabelText(/cardholder name/i)
    fireEvent.change(cardholderInput, { target: { value: 'John123' } })
    fireEvent.blur(cardholderInput)

    await waitFor(() => {
      expect(screen.getByText(/can only contain letters and spaces/i)).toBeInTheDocument()
    })
  })
})
