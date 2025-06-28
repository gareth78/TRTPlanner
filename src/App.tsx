import { useSelector } from 'react-redux';
import type { RootState } from './store/store';
import './App.css';

function App() {
  const message = useSelector((state: RootState) => state.message);

  return (
    <div className="app-container">
      <h1>{message}</h1>
    </div>
  );
}

export default App;
