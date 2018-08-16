import React, { Component } from 'react'
import { render } from 'react-dom'
import App from './App'

class Root extends Component {
  render() {
    return (
      <div>
        <App />
        <footer className="page-footer text-light p-3">
          <div className="container-fluid text-center">
            <div className="row">
              <h3 className="col font-weight-bold">Applications</h3>
            </div>
            <div className="row">
              <div className="col">
                <a className="text-light">TodoList</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}

render(<Root />, document.getElementById('root'))