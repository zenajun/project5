import React from 'react';

class Header extends React.Component {
  render() {
    return (
      <header>
        <div className="wrapper">
          <h1><i className="fas fa-paw"></i> Toronto - Unleashed</h1>
          <p>Check out the off-leash dog parks in Toronto. </p>
          <p>View all or make a custom selection that matches your needs!</p>
        </div>
      </header>
    )
  }
}

export default Header;