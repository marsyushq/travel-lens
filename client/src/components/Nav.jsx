import '../styles/Nav.css';

/**
 * Inspired by https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_shapes_trapezoid
 * 
 */
export default function Nav({ logo }){
  return (
    <header className="navbar">
      <nav>
        <img src={logo} alt="logo" className="nav-logo" />
        <div className="trapezoid"> </div>
      </nav>
    </header>
  );
}