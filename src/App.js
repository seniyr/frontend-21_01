import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Questionnaire from './Components/Questionnaire/Questionnaire'

function App() {
  return (
    <div className="App">
      <Router>
          <Switch>
            <Route exact path='/questionnaire' component={()=> <Questionnaire/>}/>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
