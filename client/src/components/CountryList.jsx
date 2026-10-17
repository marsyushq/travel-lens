import '../styles/SideBar.css';
import { useState } from 'react';
import CountryDetails from './CountryDetails';

// TBD: for error handling for country list, should it use error state from main ?
function CountryList({ countries }) {
  const [expandedIso, setExpandedIso] = useState(null);

  if (!countries || countries.length === 0) {
    return <p> No countries found.</p>;
  }
  
  const handleExpand = (iso) => {
    if (expandedIso === iso) {
      setExpandedIso(null); 
    } else {
      setExpandedIso(iso);
    }
  }; 

  return (
    <div className="country-list-container">
      <table className="country-table">
        <thead>
          <tr>
            <th>Country</th>
            <th>Visa Requirement</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => 
            <>
              <tr
                key={country.id}
                onClick={() => handleExpand(country.name)}
                className="country-row"
              >
                <td className="country-name">{country.name}</td>
                <td
                  className="country-visa"
                  style={{ backgroundColor: country.color }}>
                  <span>{country.visaStatus}</span>
                </td>
              </tr>
              {expandedIso === country.name && 
                <tr className="country-details">
                  <td colSpan={2}>
                    <CountryDetails iso={expandedIso} />
                  </td>
                </tr>
              }
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CountryList;