import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CurrentURL } from './Components/CurrentURL';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<CurrentURL />} />
      </Routes>
    </Router>
  );
}

export default App;
