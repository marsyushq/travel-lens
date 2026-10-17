import Nav from './components/Nav';
import Main from './components/Main';
import Footer from './components/Footer';
import './App.css';
import { preload } from 'react-dom';
import logo from './assets/cool-icon.png';

function App() {
  //https://react.dev/reference/react-dom/preload
  preload(logo, { as: 'image' });

  return (
    <>
      <Nav logo={logo} />
      <Main />
      <Footer />
    </>
  );
}

export default App;
