import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import App from '../App'
import * as api from '../api'

jest.mock('../api')

const mockedGetProducts = api.getProducts as jest.MockedFunction<typeof api.getProducts>
const mockedMakePurchase = api.makePurchase as jest.MockedFunction<typeof api.makePurchase>

describe('Checkout Flow - Success', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()

    mockedGetProducts.mockResolvedValue([
      { id: 1, name: 'First Product' },
      { id: 2, name: 'Second Product' },
      { id: 3, name: 'Third Product' },
    ])

    mockedMakePurchase.mockResolvedValue('success')
  })

  it('should complete the purchase flow successfully', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('First Product')).toBeInTheDocument()
      expect(screen.getByText('Second Product')).toBeInTheDocument()
      expect(screen.getByText('Third Product')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Select First Product'))

    await waitFor(() => {
      const radio = screen.getByLabelText('Select First Product') as HTMLInputElement
      expect(radio.checked).toBe(true)
    })

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /registration/i })).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText(/name/i)
    const addressInput = screen.getByLabelText(/street address/i)

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(addressInput, { target: { value: '123 Main Street' } })

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

    expect(screen.getByText('Selected Product')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: /registration information/i })).toBeInTheDocument()
    expect(screen.getAllByText(/John Doe/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/123 Main Street/i)).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: /payment information/i })).toBeInTheDocument()
    expect(screen.getAllByText(/JOHN DOE/i).length).toBeGreaterThan(0)

    fireEvent.click(screen.getByRole('button', { name: /confirm purchase/i }))

    await waitFor(() => {
      expect(mockedMakePurchase).toHaveBeenCalledTimes(1)
    })

    await waitFor(() => {
      expect(screen.getByText(/congrats!/i)).toBeInTheDocument()
      expect(screen.getByText(/you've successfully purchased a MasterClass account./i)).toBeInTheDocument()
    })
  })

  it('should navigate back and forth between steps', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('First Product')).toBeInTheDocument()
      expect(screen.getByText('Second Product')).toBeInTheDocument()
      expect(screen.getByText('Third Product')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Select First Product'))
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /registration/i })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /back/i }))

    await waitFor(() => {
      expect(screen.getByText('First Product')).toBeInTheDocument()
    })

    // this verify if the selection of the previous step if still preserved
    expect(screen.getByLabelText('Select First Product')).toBeChecked()
  })

  it('should persist the state of the form when refresh the browser', async () => {
    const { unmount } = render(<App />)

    await waitFor(() => {
      expect(screen.getByText('First Product')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Select First Product'))

    await waitFor(() => {
      expect(localStorage.getItem('checkout_wizard_state')).toBeTruthy()
    })

    // this simulate a refresh in order to check if selection is still persisted
    unmount()
    render(<App />)

    await waitFor(() => {
      expect(screen.getByLabelText('Select First Product')).toBeChecked()
    })
  })
})
