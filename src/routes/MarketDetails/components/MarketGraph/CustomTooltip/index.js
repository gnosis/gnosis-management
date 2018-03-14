import React from 'react'
import PropTypes from 'prop-types'
import { RESOLUTION_TIME } from 'utils/constants'
import _ from 'lodash'
import moment from 'moment'
import Decimal from 'decimal.js'

/**
 * Custom Rechart tooltip
 */
const CustomTooltip = ({
  payload = [], label, active, separator, itemStyle, itemSorter, labelStyle, wrapperStyle, isScalar, unit,
}) => {
  const isNumOrStr = value => (_.isNumber(value) && !_.isNaN(value)) || _.isString(value)

  const renderContentCategorical = () => {
    if (payload && payload.length) {
      const listStyle = { padding: 0, margin: 0 }

      const items = payload.filter(entry => !_.isNil(entry.value))
        .sort(itemSorter)
        .map((entry, i) => {
          const finalItemStyle = {
            display: 'block',
            paddingTop: 4,
            paddingBottom: 4,
            color: entry.color || '#000',
            ...itemStyle,
          }
          const hasName = isNumOrStr(entry.name)

          return (
            <li className="recharts-tooltip-item" key={`tooltip-item-${i}`} style={finalItemStyle}>
              {hasName && <span className="recharts-tooltip-item-name">{entry.name}</span>}
              {hasName && <span className="recharts-tooltip-item-separator">{separator}</span>}
              <span className="recharts-tooltip-item-value">
                {Decimal(entry.value).mul(100).toDP(4, 1).toString()}
              </span>
              <span className="recharts-tooltip-item-unit">%</span>
            </li>
          )
        })

      return <ul className="recharts-tooltip-item-list" style={listStyle}>{items}</ul>
    }

    return null
  }

  const renderContentScalar = () => {
    if (payload && payload.length) {
      const listStyle = { padding: 0, margin: 0 }

      const items = payload.filter(entry => !_.isNil(entry.value))
        .sort(itemSorter)
        .map((entry, i) => {
          const finalItemStyle = {
            display: 'block',
            paddingTop: 4,
            paddingBottom: 4,
            color: entry.color || '#000',
            ...itemStyle,
          }

          return (
            <li className="recharts-tooltip-item" key={`tooltip-item-${i}`} style={finalItemStyle}>
              <span className="recharts-tooltip-item-value">
                {Decimal(entry.value).toDP(4, 1).toString()}
              </span>
              <span className="recharts-tooltip-item-unit"> {unit}</span>
            </li>
          )
        })

      return <ul className="recharts-tooltip-item-list" style={listStyle}>{items}</ul>
    }

    return null
  }

  const finalStyle = {
    margin: 0,
    padding: 10,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    whiteSpace: 'nowrap',
    ...wrapperStyle,
  }
  const finalLabelStyle = {
    margin: 0,
    ...labelStyle,
  }
  const hasLabel = isNumOrStr(label)
  let finalLabel = hasLabel ? label : ''

  if (hasLabel) {
    finalLabel = moment.utc(label).local().format(RESOLUTION_TIME.ABSOLUTE_FORMAT)
  }
  if (active) {
    return (
      <div className="recharts-default-tooltip" style={finalStyle}>
        <p className="recharts-tooltip-label" style={finalLabelStyle}>{finalLabel}</p>
        {isScalar ? renderContentScalar() : renderContentCategorical()}
      </div>
    )
  }
  return (<div />)
}

CustomTooltip.propTypes = {
  payload: PropTypes.array,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  active: PropTypes.bool,
  separator: PropTypes.string,
  itemStyle: PropTypes.object,
  itemSorter: PropTypes.func,
  labelStyle: PropTypes.object,
  wrapperStyle: PropTypes.object,
  isScalar: PropTypes.bool,
  unit: PropTypes.string,
}

export default CustomTooltip
