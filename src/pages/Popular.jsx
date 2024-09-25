import React from 'react';
import MovieList from '../Components/MovieList';
import { getPopular } from '../api';

function Popular() {
  return (
    <MovieList
      category="popular"
      fetchFunction={getPopular}
      title="Popular Movies"
    />
  );
}

export default Popular;
