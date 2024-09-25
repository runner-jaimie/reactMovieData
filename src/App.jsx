import { Outlet } from 'react-router-dom';
import Header from './Components/Header';
import Popular from './pages/Popular';

export default function App() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}
