import { Component, createRef, createElement } from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@mui/material/CircularProgress';
import { common } from '@mui/material/colors'
import BrokenImage from '@mui/icons-material/BrokenImage'

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Images are ugly until they're loaded. Materialize it with material image! It will fade in like the material image loading pattern suggests.
 * @see [Image loading patterns](https://material.io/guidelines/patterns/loading-images.html)
 */
export default class Image extends Component {
  constructor (props) {
    super(props)
    this.state = {
      imageError: false,
      imageLoaded: false,
      src: this.props.src
    }
    this.image = createRef()
  }

  static getDerivedStateFromProps (props, state) {
    if (state.src !== props.src) {
      return {
        imageError: false,
        imageLoaded: false,
        src: props.src
      }
    }
    return null
  }

  componentDidMount () {
    const img = this.image.current
    if (img && img.complete) {
      // image loaded before the component rendered (e.g. SSR), see #43 and #51
      if (img.naturalWidth === 0) {
        this.handleImageError()
      } else {
        this.handleLoadImage()
      }
    }
  }

  getStyles () {
    const {
      animationDuration,
      aspectRatio,
      cover,
      color,
      imageStyle,
      disableTransition,
      iconContainerStyle,
      style
    } = this.props

    const imageTransition = !disableTransition && {
      opacity: this.state.imageLoaded ? 1 : 0,
      filterBrightness: this.state.imageLoaded ? 100 : 0,
      filterSaturate: this.state.imageLoaded ? 100 : 20,
      transition: `
        filterBrightness ${animationDuration * 0.75}ms cubic-bezier(0.4, 0.0, 0.2, 1),
        filterSaturate ${animationDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1),
        opacity ${animationDuration / 2}ms cubic-bezier(0.4, 0.0, 0.2, 1)`
    }

    const styles = {
      root: {
        backgroundColor: color,
        paddingTop: `calc(1 / ${aspectRatio} * 100%)`,
        position: 'relative',
        ...style
      },
      image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        objectFit: cover ? 'cover' : 'inherit',
        top: 0,
        left: 0,
        ...imageTransition,
        ...imageStyle
      },
      iconContainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        ...iconContainerStyle
      }
    }

    return styles
  }

  handleLoadImage = (e) => {
    this.setState({ imageLoaded: true, imageError: false })
    if (this.props.onLoad) {
      this.props.onLoad(e)
    }
  }

  handleImageError = (e) => {
    if (this.props.src) {
      this.setState({ imageError: true })
      if (this.props.onError) {
        this.props.onError(e)
      }
    }
  }

  render () {
    const styles = this.getStyles()

    const {
      animationDuration,
      aspectRatio,
      color,
      cover,
      disableError,
      disableSpinner,
      disableTransition,
      errorIcon,
      iconContainerStyle,
      imageStyle,
      loading,
      onClick,
      style,
      ...image
    } = this.props

    return /*#__PURE__*/ createElement("div", {
      style: styles.root,
      onClick: onClick
    }, image.src && /*#__PURE__*/createElement("img", _extends({}, image, {
      ref: this.image,
      style: styles.image,
      onLoad: this.handleLoadImage,
      onError: this.handleImageError
    })), /*#__PURE__*/createElement("div", {
      style: styles.iconContainer
    }, !disableSpinner && !this.state.imageLoaded && !this.state.imageError && loading, !disableError && this.state.imageError && errorIcon));

  }
}

Image.defaultProps = {
  animationDuration: 3000,
  aspectRatio: 1,
  color: common.white,
  disableError: false,
  disableSpinner: false,
  disableTransition: false,
  errorIcon: createElement(BrokenImage, {
    style: {
      width: 48, 
      height: 48, 
      color: '#e0e0e0'
    }
  }),
  loading: createElement(CircularProgress, {
    size: 48
  })
}

Image.propTypes = {
  /** Duration of the fading animation, in milliseconds. */
  animationDuration: PropTypes.number,
  /** Override aspect ratio. */
  aspectRatio: PropTypes.number,
  /** Override the object fit to cover. */
  cover: PropTypes.bool,
  /** Override the background color. */
  color: PropTypes.string,
  /** Disables the error icon if set to true. */
  disableError: PropTypes.bool,
  /** Disables the loading spinner if set to true. */
  disableSpinner: PropTypes.bool,
  /** Disables the transition after load if set to true. */
  disableTransition: PropTypes.bool,
  /** Override the error icon. */
  errorIcon: PropTypes.node,
  /** Override the inline-styles of the container that contains the loading spinner and the error icon. */
  iconContainerStyle: PropTypes.object,
  /** Override the inline-styles of the image. */
  imageStyle: PropTypes.object,
  /** Override the loading component. */
  loading: PropTypes.node,
  /** Fired when the user clicks on the image happened. */
  onClick: PropTypes.func,
  /** Fired when the image failed to load. */
  onError: PropTypes.func,
  /** Fired when the image finished loading. */
  onLoad: PropTypes.func,
  /** Specifies the URL of an image. */
  src: PropTypes.string.isRequired,
  /** Override the inline-styles of the root element. */
  style: PropTypes.object
}
