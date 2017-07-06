import React, { Component } from 'react'
import moment from 'moment'
import autobind from 'autobind-decorator'
import { Field } from 'redux-form'

import { ORACLE_TYPES, OUTCOME_TYPES } from 'utils/constants'
import './marketCreateWizard.less'

import MarketSidebar from 'components/MarketSidebar'

import GroupCentralizedOracle from 'components/GroupCentralizedOracle'
import GroupBlockDifficulty from 'components/GroupBlockDifficulty'

import FormRadioButton, { FormRadioButtonLabel } from 'components/FormRadioButton'
import FormSlider from 'components/FormSlider'
import FormInput from 'components/FormInput'

export default class MarketCreateWizard extends Component {
  @autobind
  handleSubmit(values) {
    const { resolutionDate, fee, funding, outcomes, ...market } = values

    market.fee = parseFloat(fee)
    market.funding = parseFloat(funding)
    market.resolutionDate = moment(resolutionDate).format()
    market.outcomes = outcomes.filter(outcome => outcome.length > 0)
    console.log(market)
    return this.props.createMarket(market)
  }

  renderHeading(index, title) {
    return (
      <div className="row">
        <div className="col-md-2">
          <div className="marketWizardHeading marketWizardHeading__number">{index}</div>
        </div>
        <div className="col-md-10">
          <h2 className="marketWizardHeading marketWizardHeading__title">{title}</h2>
        </div>
      </div>)
  }

  renderOracleTypes() {
    const oracleValueLabels = {
      [ORACLE_TYPES.CENTRALIZED]: 'Centralized Oracle',
      [ORACLE_TYPES.BLOCK_DIFFICULTY]: 'Block Difficulty',
    }

    return (
      <div className="row">
        <div className="col-md-offset-2 col-md-10">
          <FormRadioButtonLabel label="Oracle Type" />
          {Object.keys(oracleValueLabels).map(fieldValue =>
            <Field key={fieldValue} name="oracleType" component={FormRadioButton} radioValue={fieldValue} text={oracleValueLabels[fieldValue]} />,
          )}
        </div>
      </div>
    )
  }

  renderMarketDetails() {
    const currencies = {
      0xa586074fa4fe3e546a132a16238abe37951d41fe: 'Ether Token',
    }

    return (
      <div className="marketDetails">
        <div className="row">
          <div className="col-md-offset-2 col-md-10">
            <FormRadioButtonLabel label="Currency" />
            {Object.keys(currencies).map(fieldValue =>
              <Field key={fieldValue} name="collateralToken" component={FormRadioButton} radioValue={fieldValue} text={currencies[fieldValue]} />,
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-offset-2 col-md-10">
            <Field name="fee" component={FormSlider} min={0} max={10} label="Fee" unit="%" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-offset-2 col-md-10">
            <Field name="funding" component={FormInput} type="number" label="Funding" />
          </div>
        </div>
      </div>
    )
  }

  renderForOracleType() {
    const { selectedOracleType, selectedOutcomeType } = this.props
    const oracleSections = {
      [ORACLE_TYPES.CENTRALIZED]: <GroupCentralizedOracle selectedOutcomeType={selectedOutcomeType} />,
      [ORACLE_TYPES.BLOCK_DIFFICULTY]: <GroupBlockDifficulty />,
    }

    return oracleSections[selectedOracleType]
  }

  renderForm() {
    return (
      <div className="marketCreate__form">
        {this.renderHeading(1, 'Event Details')}
        {this.renderOracleTypes()}
        {this.renderForOracleType()}
        {this.renderHeading(2, 'Market Details')}
        {this.renderMarketDetails()}
      </div>
    )
  }

  render() {
    const { handleSubmit } = this.props

    return (
      <div className="marketCreateWizardPage">
        <div className="marketCreateWizardPage__header">
          <div className="container">
            <h1>Create Market</h1>
          </div>
        </div>
        <form ref={(node) => { this.formElement = node }} onSubmit={handleSubmit(this.handleSubmit)}>
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                {this.renderForm()}
              </div>
              <div className="col-md-4">
                <MarketSidebar fields={{ Test: true, Bla: false }} />
                <button className="marketCreateButton btn btn-primary" type="submit">Review &#10140;</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }

}
