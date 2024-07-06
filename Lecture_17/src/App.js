import './App.css';
import { Component} from "react";

class App extends Component {

  name = "Rishabh";

  render() {
  return(
    <>
    <div>
      <h1>This is {this.name}!</h1>
    </div>
    <div>
      <p>This is a paragraph and the name is {this.name}!</p>
    </div>
    </>
  )
  }
}

export default App;
