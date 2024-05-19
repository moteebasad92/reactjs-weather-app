import logo from './logo.svg';
import './App.css';
import Main from './components/Main';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h1 className='app-title'>Weather App</h1>
        <Main />
      </div>
    </QueryClientProvider>
  );
}

export default App;
