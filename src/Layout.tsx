import React, { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <section>
      <header>
        <nav>
          <h4>MasterClass</h4>
        </nav>
      </header>

      <main>{children}</main>
    </section>
  )
}

export default Layout
