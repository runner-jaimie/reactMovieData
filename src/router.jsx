import App from './App';
import { createBrowserRouter } from 'react-router-dom';
import Popular from './pages/Popular';
import ComingSoon from './pages/ComingSoon';
import NowPlaying from './pages/NowPlaying';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Popular />,
      },
      {
        path: 'coming-soon',
        element: <ComingSoon />,
      },
      {
        path: 'now-playing',
        element: <NowPlaying />,
      },
      {
        path: 'movies/:movieId',
        element: <Popular />,
      },
    ],
  },
]);
