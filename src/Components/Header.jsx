import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useMatch } from 'react-router-dom';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  max-width: 500px; 
  margin: 0 auto;
  padding: 30px 0;
  
`;

const Item = styled.li`
  color: #fff;
  transition: color 0.3s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  font-size: 20px;
  &:hover {
    color: #007bff;
  }
`;

const Circle = styled(motion.span)`
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: red;
  border-radius: 5px;
  bottom: -5px;
  left: 0;
  right: 0;
  margin: 0 auto;
`;

function Header() {
  const homeMatch = useMatch('/');
  const comingSoonMatch = useMatch('/coming-soon');
  const nowPlayingMatch = useMatch('/now-playing');

  return (
    <Nav>
      <Item>
        <Link to="/">POPULAR {homeMatch && <Circle layoutId="circle" />}</Link>
      </Item>
      <Item>
        <Link to="/coming-soon">
          COMING SOON {comingSoonMatch && <Circle layoutId="circle" />}
        </Link>
      </Item>
      <Item>
        <Link to="/now-playing">
          NOW PLAYING {nowPlayingMatch && <Circle layoutId="circle" />}
        </Link>
      </Item>
    </Nav>
  );
}

export default Header;
