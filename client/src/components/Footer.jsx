import { FaSquareGitlab } from 'react-icons/fa6';
import '../styles/Footer.css';


export default function Footer(){
  const passportIndexUrl = 
    `https://github.com/ilyankou/passport-index-dataset/blob/master/
    passport-index-matrix.csv`;
  
  const safetyIndexUrl = 
    `https://www.kaggle.com/datasets/romanlisachov/
    safety-index-for-the-last-5-years?select=crime_rankings_2024.csv`;
  
  const tourismUrl = 
    'https://www.kaggle.com/datasets/imtkaggleteam/tourism?resource=download';
  
  const gitlabUrl = 
    `https://gitlab.com/dawson-cst-cohort-2026/520/section1/
    teams/Team-D13/520-project-seto-tran-skrypnichenko`;


  return (
    <footer>
      <div className="footer-wrapper">   
        <div className="credit-contaner">
          <h3>Data Source Attributions:</h3>
          <ul>
            <li>
              <a 
                href={passportIndexUrl}
                target="_blank"
              > 
                Passport-index Dataset
              </a>
            </li>
            <li>
              <a 
                href={safetyIndexUrl}
                target="_blank"
              >
                Safety-index Dataset
              </a>
            </li>
            <li>
              <a 
                href={tourismUrl}
                target="_blank">Tourism Dataset
              </a>
            </li>
          </ul>  
        </div>
        <div className="info">
          <a 
            href={gitlabUrl}
            target="_blank" 
            className="gitlab-icon"
          >
            <FaSquareGitlab className="gitlab-icon" />
          </a>
          <p> Developed by </p>
          <ul>
            <li>Jaidan Seto</li>
            <li>Candy Tran</li>
            <li>Yuliia Skrypnichenko</li>
          </ul>
        </div>
      </div>
      <p id="copy-text">This project was developed by Dawson College students.</p>
    </footer>
  );
}