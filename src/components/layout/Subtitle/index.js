import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import * as css from './index.css'

const cx = classNames.bind(css)

class Subtitle extends PureComponent {
  render() {
    const { children, ...props } = this.props

    return (
      <h3 className={cx('ol-subtitle')} {...props}>
        { children }
      </h3>
    )
  }
}

Subtitle.propTypes = {
  children: PropTypes.node,
}

export default Subtitle
