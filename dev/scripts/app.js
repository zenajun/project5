import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    render() {
      return (
        <div>
          <p>I need this to show up on gh-pages</p>

        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
