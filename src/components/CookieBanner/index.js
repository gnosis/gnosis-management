import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import autobind from 'autobind-decorator'
import CSSTransition from 'react-transition-group/CSSTransition'
import Cookies from 'js-cookie'
import style from './style.scss'

const cx = cn.bind(style)

class CookieBanner extends Component {
  state = {
    shown: false,
  }

  componentDidMount() {
    const { display, options } = this.props
    const cookies = options.map(({ label }) => ({ label, cookie: Cookies.get(label) }))
    const noCookiesSet = !cookies.filter(({ cookie }) => typeof cookie !== 'undefined').length

    let shouldShow = display

    // if display property wasn't provided, that means we take care of displaying the component
    // if there are no cookies set, then the component will be displayed
    if (typeof shouldShow === 'undefined') {
      shouldShow = noCookiesSet
    }

    if (shouldShow) {
      this.setState({ shown: true })
    } else {
      cookies.map(({ label: thirdPartyName, cookie }) => {
        if (cookie === 'yes') {
          options.find(({ label }) => label === thirdPartyName).initFunc()
        }
      })
    }
  }

  @autobind
  handleDeclineCookies() {
    const { options } = this.props

    options.forEach((option) => {
      Cookies.set(option.label, 'no', { expires: 3 })
    })
  }

  @autobind
  handleAcceptCookies() {
    const { options, selected } = this.props

    options.forEach((option) => {
      if (selected.indexOf(option.label) > -1) {
        Cookies.set(option.label, 'yes', { expires: 1000 })
        option.initFunc()
      } else {
        Cookies.set(option.label, 'no', { expires: 3 })
      }
    })

    this.setState({
      shown: false,
    })
  }

  @autobind
  handleClose() {
    this.handleDeclineCookies()

    this.setState({
      shown: false,
    })
  }

  @autobind
  handleOptionClick({ target: { id } }) {
    const { onChange } = this.props
    onChange(id)
  }

  render() {
    const { options, selected } = this.props
    const { shown } = this.state

    const animationClassNames = {
      enter: cx('float-enter'),
      enterActive: cx('float-enter-active'),
      exit: cx('float-exit'),
      exitActive: cx('float-exit-active'),
    }

    return (
      <CSSTransition in={shown} classNames={animationClassNames} timeout={300} unmountOnExit>
        <div className={cx('cookieBar')}>
          <p>
            We use cookies to give you the best experience and to help improve our website. Please read our{' '}
            <a href="/cookies">Cookie Policy</a> for more information. By clicking &quot;Accept Cookies,&quot; you agree
            to the storing of cookies on your device to enhance site navigation and analyze site usage.
          </p>
          <div className={cx('settings')}>
            <span className={cx('options')}>
              {options.map(({ label }) => (
                <div key={label} className={cx('checkbox')}>
                  <input
                    id={label}
                    type="checkbox"
                    onChange={this.handleOptionClick}
                    checked={selected.indexOf(label) > -1}
                  />
                  <label htmlFor={label}>{label}</label>
                </div>
              ))}
            </span>
            <button type="button" onClick={this.handleAcceptCookies} className={cx('button', 'accept')}>
              Accept Cookies
            </button>
          </div>
          <div className={cx('closeButton')} onClick={this.handleClose} />
        </div>
      </CSSTransition>
    )
  }
}

CookieBanner.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      initFunc: PropTypes.func.isRequired,
    }),
  ).isRequired,
  selected: PropTypes.arrayOf(PropTypes.string),
  display: PropTypes.bool,
  onChange: PropTypes.func,
}

CookieBanner.defaultProps = {
  selected: [],
  display: undefined,
  onChange: () => {},
}

export default CookieBanner
