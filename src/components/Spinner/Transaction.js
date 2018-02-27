import React from 'react'
import PropTypes from 'prop-types'
import { TRANSACTION_COMPLETE_STATUS } from 'utils/constants'

import IndefiniteSpinner from './Indefinite'

const ProgressIndicator = ({ completed, completionStatus, progress }) => {
  const iconType = completionStatus === TRANSACTION_COMPLETE_STATUS.NO_ERROR ? 'checkmark' : 'error'

  return completed ? (
    <div className="transaction__icon">
      <div className={`icon icon--${iconType}`} />
    </div>
  ) : (
    <IndefiniteSpinner width={32} height={32} strokeWidthPx={1} fontSizePx={8} progress={progress} modifier="spinning" />
  )
}

ProgressIndicator.propTypes = {
  completed: PropTypes.bool,
  completionStatus: PropTypes.string,
  progress: PropTypes.number,
}

ProgressIndicator.defaultProps = {
  completed: false,
  completionStatus: undefined,
  progress: 0,
}

export default ProgressIndicator
