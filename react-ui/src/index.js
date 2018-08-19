import React, { Component } from 'react'
import { render } from 'react-dom'
import App from './App'
import { Footer } from './Applications/Applications'
import { BrowserRouter as Router } from 'react-router-dom';

class Root extends Component {
  render() {
    return (
      <div>
        <App />
        <Router>
          <Footer />
        </Router>
      </div>
    )
  }
}

render(<Root />, document.getElementById('root'))