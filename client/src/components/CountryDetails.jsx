import { useState, useEffect } from 'react';
import '../styles/CountryDetails.css';

//passing an iso from country list to track the clicked element 
function CountryDetails({ iso }) {
    
  const [details, setDetails] = useState(null); 
  const [error, setError] = useState(null);
    
  useEffect(() => {
    //async function to fetch data 
    const fetchDetails = async () => {
      setError(null);
      try {
        const res = await fetch(`/api/v1/tourism/details/${iso}`);
        if (!res.ok) {
          throw new Error('Failed to fetch country details');
        }
        const data = await res.json();
        setDetails(data[0]);
      } catch (err) {
        setError(err.message);
      } 
    };
    fetchDetails();
  }, [iso]);

  return (
    <div className="country-details-elem">
      {error && 
        <p>Error: {error}</p>
      }
      <p>Safety Index: {details?.safety ?? 'Not Available'}</p>
      <h4>Tourists per year</h4>
      {details?.years && details.years.length > 0 ?
        <table className="tourism-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Visitors</th>
            </tr>
          </thead>
          <tbody>
            {details?.years.map((item) => 
              <tr key={item.year}>
                <td>{item.year}</td>
                <td>{item.visitors}</td>
              </tr>
            )}
          </tbody>
        </table>
        :
        <p> Not Available </p>
      }
    </div>
  );
}

export default CountryDetails;