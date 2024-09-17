// Write your code here
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import {Component} from 'react'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: [],
    quantity: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getProductItemDetails()
  }

  formattedData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    price: data.price,
    description: data.description,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
    similarProducts: data.similar_products.map(product => ({
      id: product.id,
      imageUrl: product.image_url,
      title: product.title,
      style: product.style,
      price: product.price,
      description: product.description,
      brand: product.brand,
      totalReviews: product.total_reviews,
      rating: product.rating,
      availability: product.availability,
    })),
  })

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inprogress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://api.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = this.formattedData(data)
      console.log(updatedData)
      this.setState({
        productDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status_code === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickingContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  onDecrement = () => {
    const {quantity} = this.state
    if (quantity !== 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    } else {
      this.setState({quantity: 1})
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderProductDetail = () => {
    const {productDetails, quantity} = this.state
    const {
      id,
      imageUrl,
      title,
      price,
      description,
      rating,
      totalReviews,
      availability,
      brand,
    } = productDetails
    return (
      <div className="product-item-container">
        <img src={imageUrl} alt="product" className="detailed-image" />
        <div className="content-container">
          <h1>{title}</h1>
          <p className="product-price">Rs. {price}/-</p>
          <div className="ratings-reviews">
            <div className="rating-container">
              <p>{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star-image"
              />
            </div>
            <p>{totalReviews} Reviews</p>
          </div>
          <p className="description">{description}</p>
          <p>
            <span className="span-style">Available:</span> {availability}
          </p>
          <p>
            <span className="span-style">Brand:</span> {brand}
          </p>
          <hr className="line" />
          <div className="icons-container">
            <button
              type="button"
              className="icon-button"
              onClick={this.onDecrement}
              data-testid="minus"
            >
              <BsDashSquare />
            </button>
            <p>{quantity}</p>
            <button
              type="button"
              className="icon-button"
              onClick={this.onIncrement}
              data-testid="plus"
            >
              <BsPlusSquare />
            </button>
          </div>
          <button type="button" className="addcart-button">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  renderSimilarProducts = () => {
    const {productDetails} = this.state
    const {similarProducts} = productDetails
    return (
      <div className="similar-products-conatiner">
        <h1>Similar Products</h1>
        <ul className="similar-items-list">
          {similarProducts.map(product => (
            <SimilarProductItem key={product.id} product={product} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loading-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductItemDetails = () => (
    <>
      <Header />
      {this.renderProductDetail()}
      {this.renderSimilarProducts()}
    </>
  )

  renderFailureView = () => (
    <>
      <Header />
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="error view"
        />
        <h1>Product Not Found</h1>
        <button
          type="button"
          className="continue-shopping-button"
          onClick={this.onClickingContinueShopping}
        >
          Continue Shopping
        </button>
      </div>
    </>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inprogress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default ProductItemDetails
