import { StrictMode } from 'react';
import './index.css';
import Components from "./component/component";

function App() {
  return (
    <StrictMode>
      <div className="App">
        <Components />
      </div>
    </StrictMode>
  );
}

export default App;
