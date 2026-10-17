import { useState } from 'react';
import CountryMap from './Map';
import InfoPopup from './InfoPopup';
import SideBar from './SideBar';
import CountryStats from './CountryStats';
import '../styles/Main.css';

export default function Main(){
  /**
   * from: USA
   * to: {
   *  CAN: visa-free, 
   *  FRA: e-visa,
   * }
   */
  const [visaData, setVisaData] = useState(null);
  const [error, setError] = useState(null);
  /**  
   * USA: "green",
   * RUS: "red",
   */
  //can be used to in CountryList component 
  const [countryColors, setCountryColors] = useState({});
  //contains the selected country iso code
  const [selected, setSelected] = useState(null);
  
  // available visa colours.
  const visaOptions = [
    { id: 'visa-green', label: 'visa free', color: '#226823' },
    { id: 'visa-red', label: 'visa required', color: '#A32121' },
    { id: 'visa-blue', label: 'eta', color: '#3266B1' },
    { id: 'visa-yellow', label: 'visa on arrival', color: '#9B870C' },
    { id: 'visa-orange', label: 'e-visa', color: '#CC6600' },
  ];

  //would be a great idea to improve error handling later 
  return(
    <main>
      <InfoPopup /> 
      {error && 
        <div className="alert-wrapper">
          <div className="alert-box error">
            <strong>Error:</strong> {error}
            <div className="warning-msg">
              Please select another country or try again later.
            </div>
          </div>
        </div>
      }

      <div className="main-section">
        <div className="stats-container">
          <CountryStats selected={selected} setError={setError} />
        </div>

        <div className="map-container">
          
          <CountryMap
            setSelected={setSelected}
            setVisaData={setVisaData}
            countryColors={countryColors}
            setCountryColors={setCountryColors}
            visaOptions={visaOptions}
            setError={setError}
          />
        </div>

        <div className="sidebar-wrapper">
          <SideBar
            countriesColors={countryColors}
            visaData={visaData}
            visaOptions={visaOptions}
          />
        </div>

      </div>
      
    </main>
  );  
}

    
