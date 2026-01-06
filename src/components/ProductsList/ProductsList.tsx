import { Product } from 'types'
import './ProductsList.css'

interface ProductsListProps {
  products: Product[];
  selectedProductId: number | null;
  onProductSelect: (productId: number) => void;
}

const ProductsList = ({ products, selectedProductId, onProductSelect }: ProductsListProps) => {
  return (
    <div
      className="products-list"
      role="radiogroup"
      aria-label="Product selection"
    >
      {products.map((product) => {
        const isSelected = selectedProductId === product.id;

        return (
          <div
            key={product.id}
            className={`product-card ${isSelected ? 'product-card--selected' : ''}`}
            onClick={() => onProductSelect(product.id)}
          >
            {isSelected && (
              <div className="product-card__badge">
                Selected
              </div>
            )}

            <input
              type="radio"
              id={`product-${product.id}`}
              name="product"
              value={product.id}
              checked={isSelected}
              onChange={() => onProductSelect(product.id)}
              aria-label={`Select ${product.name}`}
              className="product-card__input"
            />

            <label
              htmlFor={`product-${product.id}`}
              className="product-card__label"
            >
              <h3 className={`product-card__title ${isSelected ? 'product-card__title--selected' : ''}`}>
                {product.name}
              </h3>

              <div className={`product-card__icon ${isSelected ? 'product-card__icon--selected' : ''}`}>
                {isSelected ? (
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="#e50914"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <div className="product-card__icon-inner" />
                )}
              </div>
            </label>
          </div>
        );
      })}
    </div>
  )
}


export default ProductsList
