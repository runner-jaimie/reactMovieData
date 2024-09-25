import React from 'react';
import MovieList from '../Components/MovieList';
import { getComingSoon } from '../api';

function ComingSoon() {
  return (
    <MovieList
      category="coming-soon"
      fetchFunction={getComingSoon}
      title="Coming Soon Movies"
    />
  );
}

export default ComingSoon;
