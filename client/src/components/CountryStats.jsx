import { useEffect } from 'react';
import { useState } from 'react'; 
import '../styles/CountryStats.css';

export default function CountryStats(
  {selected, setError}
) {
  //The visa categories.
  const [visaFree, setVisaFree] = useState([]);
  const [visaRequired, setVisaRequired] = useState([]);
  const [etaVisas, setEtaVisas] = useState([]);
  const [visaOnArrival, setVisaOnArrival] = useState([]);
  const [eVisa, setEVisa] = useState([]);

  function clearStats() {
    setVisaFree([]);
    setVisaRequired([]);
    setEtaVisas([]);
    setVisaOnArrival([]);
    setEVisa([]);
  }

  useEffect(() => {

    if(!selected){
      clearStats();
      return;
    }

    async function fetchData(url) {
      try {
        const data = await fetch(url);

        if (!data.ok) {
          setError('Failed to get data.');
          return false;
        }
        return data.json();
      } catch (error) {
        console.error(error);
        return false;
      }
    }
    if (selected) {
      const url = `/api/v1/visa/visa-data/count/${selected}`;
      fetchData(url).then((data) => {

        setVisaFree(data.visaFree);
        setVisaRequired(data.visaRequired);
        setEVisa(data.eVisa);
        setVisaOnArrival(data.visaOnArrival);
        setEtaVisas(data.eta);
      });
    }
        
  }, [selected, setError] );

  return (
    <table className="country-stats">
      {selected === null ? 
        <caption> No stats found. </caption> 
        :
        <caption> {selected} </caption>}
      <tbody>
        <tr>
          <th>Visa Free: </th>
          <td>{visaFree}</td>
        </tr>
        <tr>
          <th>Visa Required: </th>
          <td>{visaRequired}</td>
        </tr>
        <tr>
          <th>ETA Required: </th>
          <td>{etaVisas}</td>
        </tr>
        <tr>
          <th>Visa on Arrival: </th>
          <td>{visaOnArrival}</td>
        </tr>
        <tr>
          <th>E-Visa Required: </th>
          <td>{eVisa}</td>
        </tr> 
      </tbody>
    </table>
  );
}