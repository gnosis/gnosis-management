import '@babel/polyfill'
import 'whatwg-fetch'

import React from 'react'
import { render } from 'react-dom'

import 'normalize.css?raw'
import './style/embedded.css?raw'

import { setMomentRelativeTime, setMomentDurationFormat } from '../setup'

import RootComponent from './components/Root'

setMomentRelativeTime()
setMomentDurationFormat()

render(<RootComponent />, document.getElementById('root'))
