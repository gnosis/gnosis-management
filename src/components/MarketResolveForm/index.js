import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import autobind from 'autobind-decorator'
import Decimal from 'decimal.js'

import { OUTCOME_TYPES } from 'utils/constants'
import { marketShape } from 'utils/shapes'

import InteractionButton from 'containers/InteractionButton'

import FormRadioButton from 'components/FormRadioButton'
import FormInput from 'components/FormInput'

import './marketResolveForm.less'

class MarketResolveForm extends Component {
  @autobind
  handleResolve(values) {
    const { market: { event: { type }, eventDescription: { decimals } } } = this.props

    const { selectedOutcome, selectedValue } = values

    if (type === OUTCOME_TYPES.CATEGORICAL) {
      return this.props.resolveMarket(this.props.market, selectedOutcome)
    } else if (type === OUTCOME_TYPES.SCALAR) {
      const outcome = Decimal(selectedValue).times(10 ** decimals)
      return this.props.resolveMarket(this.props.market, outcome.trunc())
    }

    throw new Error(`got unexpected type ${type}`)
  }
  renderResolveScalar() {
    const { handleSubmit, submitting, market } = this.props
    const { eventDescription: { unit } } = market
    return (
      <form className="marketResolve" onSubmit={handleSubmit(this.handleResolve)}>
        <div className="marketResolveScalar">
          <Field continuousPlaceholder={unit} name="selectedValue" component={FormInput} label="Enter outcome" />
        </div>
        <InteractionButton type="submit" className="btn btn-primary" loading={submitting}>
          Resolve Oracle
        </InteractionButton>
      </form>
    )
  }

  renderResolveCategorical() {
    const { handleSubmit, submitting, market: { eventDescription: { outcomes }, local } } = this.props
    const outcomesFormatted = []
    outcomes.forEach((outcome, outcomeIndex) => {
      outcomesFormatted.push({ label: outcome, value: outcomeIndex })
    })

    return (
      <form className="marketResolve" onSubmit={handleSubmit(this.handleResolve)}>
        <div className="marketResolveCategorical">
          <Field
            className="marketResolveFormRadio"
            name="selectedOutcome"
            component={FormRadioButton}
            radioValues={outcomesFormatted}
          />
        </div>
        <InteractionButton type="submit" className="btn btn-primary" loading={submitting || local}>
          Resolve Oracle
        </InteractionButton>
      </form>
    )
  }

  render() {
    const { submitting, market: { event: { type }, oracle: { isOutcomeSet } } } = this.props

    if (submitting) {
      return <span>Resolving Oracle...</span>
    }

    if (isOutcomeSet) {
      return <span>Oracle already resolved</span>
    }

    if (type === OUTCOME_TYPES.SCALAR) {
      return this.renderResolveScalar()
    } else if (type === OUTCOME_TYPES.CATEGORICAL) {
      return this.renderResolveCategorical()
    }

    return <span>Something went wrong. Please reload the page</span>
  }
}

MarketResolveForm.propTypes = {
  market: marketShape,
  submitting: PropTypes.bool,
  resolveMarket: PropTypes.func,
  handleSubmit: PropTypes.func,
}

const FORM = {
  form: 'MarketResolveForm',
}

export default reduxForm(FORM)(MarketResolveForm)
