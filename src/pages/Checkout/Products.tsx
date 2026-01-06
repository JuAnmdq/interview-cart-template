import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'mc-components'
import { getProducts } from 'api'
import { Product } from 'types'
import ProductsList from 'components/ProductsList/ProductsList'
import { CheckoutStep, useCheckout } from 'context/CheckoutContext'

const Products: React.FC = () => {
  const history = useHistory()
  const { state, selectProduct, setStep } = useCheckout()
  const [products, setProducts] = useState<Product[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const data = await getProducts()
        if (isMounted) {
          setProducts(data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
    }
  }, [])

  const handleNext = () => {
    if (state.cart.selectedProductId === null) {
      alert('Please select a product')
      return
    }
    setStep(CheckoutStep.REGISTRATION)
    history.push('/checkout/registration')
  }

  const handleProductSelect = (productId: number) => {
    selectProduct(productId)
  }

  if (isLoading) {
    return (
      <div role="status" aria-live="polite">
        Loading products...
      </div>
    )
  }

  if (error) {
    return (
      <div role="alert" aria-live="assertive">
        Error loading products: {(error as Error).message}
      </div>
    )
  }

  return (
    <div>
      <h2>Select a Product</h2>

      {products && (
        <ProductsList
          products={products}
          selectedProductId={state.cart.selectedProductId}
          onProductSelect={handleProductSelect}
        />
      )}

      <hr />

      <Button onClick={handleNext} disabled={state.cart.selectedProductId === null}>
        Continue
      </Button>
    </div>
  )
}

export default Products
