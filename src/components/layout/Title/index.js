import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import * as React from 'react'
import * as css from './index.css'

const cx = classNames.bind(css)

class Title extends React.PureComponent {

    render() {
        const { children, ...props } = this.props

        return (
          <h1 className={cx('ol-title')} {...props}>
            { children }
          </h1>
        )
    }
}

Title.propTypes = {
    children: PropTypes.node,
}

export default Title
