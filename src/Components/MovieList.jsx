import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { useNavigate, useMatch } from 'react-router-dom';
import styled from 'styled-components';
import { getMovie, makeBannerImagePath } from '../api';

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  color: white;
  align-items: center;
`;

const Banner = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  font-weight: 300;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -200px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)`
  background-color: white;
  height: 200px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  font-size: 64px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 20px;
  background-color: #2f2f2f;
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: #000;
`;

const BigCover = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 80%, rgba(0,0,0,1) 100%);
  }
`;

const ContentWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
`;

const BigTitle = styled.h3`
  color: white;
  font-size: 32px;
  margin-bottom: 10px;
`;

const BigOverview = styled.p`
  color: #d2d2d2;
  font-size: 18px;
  line-height: 1.5;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
`;

const MovieInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: #fff;
  font-size: 14px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 5px 0;
  font-weight: 300;
`;

const rowVariants = {
  hidden: { x: window.outerWidth + 5 },
  visible: { x: 0 },
  exit: { x: -window.outerWidth - 5 },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duration: 0.4,
      type: 'tween',
    },
  },
};

const infoVariants = {
  hover: {
    zIndex: 99,
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: 'tween',
    },
  },
};

const offset = 6;

function MovieList({ category, fetchFunction, title }) {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch('/movies/:movieId');
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery(['movies', category], fetchFunction);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const { data: movieDetails } = useQuery(
    ['movieDetails', bigMovieMatch?.params.movieId],
    () => getMovie(bigMovieMatch?.params.movieId),
    {
      enabled: !!bigMovieMatch?.params.movieId,
    }
  );

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  const onOverlayClick = () => navigate('/');

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeBannerImagePath(data?.results[0].backdrop_path || '')}
          >
            <Title>{title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: 'tween', duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ''}
                      key={movie.id}
                      whileHover={'hover'}
                      variants={boxVariants}
                      initial={'normal'}
                      onClick={() => onBoxClicked(movie.id)}
                      transition={{ type: 'tween' }}
                      bgPhoto={makeBannerImagePath(movie.backdrop_path, 'w500')}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeBannerImagePath(
                            clickedMovie.backdrop_path,
                            'w500'
                          )})`,
                        }}
                      />
                      <ContentWrapper>
                        <BigTitle>{clickedMovie.title}</BigTitle>
                        <BigOverview>{clickedMovie.overview}</BigOverview>
                        <MovieInfo>
                          <InfoItem>
                            <p>Release Date:&nbsp;</p>
                            <p>{clickedMovie.release_date}</p>
                          </InfoItem>
                          <InfoItem>
                            <p>Popularity:&nbsp;</p>
                            <p>{clickedMovie.popularity.toFixed(1)}</p>
                          </InfoItem>
                          <InfoItem>
                            <p>Runtime: &nbsp;</p>
                            <p>
                              {clickedMovie.vote_count.toLocaleString()}
                              &nbsp;minutes
                            </p>
                          </InfoItem>
                          <InfoItem>
                            <p>Rating:&nbsp; </p>
                            <p>{clickedMovie.vote_average}</p>
                          </InfoItem>
                        </MovieInfo>
                      </ContentWrapper>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default MovieList;
