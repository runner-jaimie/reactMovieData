import React from 'react';
import MovieList from '../Components/MovieList';
import { getNowPlaying } from '../api';

function NowPlaying() {
  return (
    <MovieList
      category="now-playing"
      fetchFunction={getNowPlaying}
      title="Now Playing Movies"
    />
  );
}

export default NowPlaying;
