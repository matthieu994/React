import React, { Component } from 'react'
import { render } from 'react-dom'
import Routes from './Routes'
import Footer from './Components/Footer'
import Links from './Components/Links'
import UserIcon from './Components/UserIcon'
import { BrowserRouter as Router } from 'react-router-dom'

class Root extends Component {
  render() {
    return (
      <Router>
        <div>
          <Routes />

          <Links />
          <UserIcon />
          <Footer />
        </div>
      </Router>
    )
  }
}

render(<Root />, document.getElementById('root'))