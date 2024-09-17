// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {product} = props
  const {imageUrl, title, brand, price, rating} = product
  return (
    <li className="each-item">
      <img src={imageUrl} alt={`similar product ${title}`} />
      <h1 className="similar-title">{title}</h1>
      <p>by {brand}</p>
      <div className="price-rating">
        <p>Rs {price}/-</p>
        <div className="rating-cont">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-similar"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
