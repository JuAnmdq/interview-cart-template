import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import CheckoutLayout from './pages/Checkout/Layout/Layout'
import { CheckoutProvider } from './context/CheckoutContext'
import Layout from './Layout'

const App: React.FC = () => {
  return (
    <Router>
        <Layout>
          <Switch>
            <Route path="/checkout">
              <CheckoutProvider>
                <CheckoutLayout />
              </CheckoutProvider>
            </Route>
            <Route exact path="/">
              <Redirect to="/checkout/products" />
            </Route>
          </Switch>
        </Layout>
      </Router>
  )
}

export default App
