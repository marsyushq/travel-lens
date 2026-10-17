import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css';

/**
 * referred to the following sources: 
 * https://medium.com/@gisjohnecs/part-2-web-mapping-with-leaflet-react-js-adef75f8aedc
 * https://stackoverflow.com/questions/37661136/react-and-leaflet 
 * https://www.youtube.com/watch?v=D4jq5Bd9bTA
 */

// in the db => selected country = '-1'
const selectedColor = '#815ac0';

export default function CountryMap({
  setSelected, 
  setVisaData,
  countryColors,
  setCountryColors,
  visaOptions,
  setError
}) {
  const [mapData, setMapData] = useState(null);
  
  //useEffect used to load the coordinates needed to initialize the map. 
  useEffect(() => {
    const initializeMap = async () =>{
      try{
        const res = await fetch('/api/v1/map');      
        if(!res.ok){
          throw new Error(`Server response: ${res.status}`);
        }
        const data = await res.json();
        setMapData(data);
      } catch(error){
        console.error(error);
        //dislay a general message to the user 
        setError('Could not initialize the map');
      }
    };
    initializeMap();
  }, [setError]);
  
  //doesn't re-render the map component on every change 
  //sets a reference to the layer object in leaflet 
  const geoJsonRef = useRef(null);

  //had a warning saying that I had to wrap it in a callback 
  const fillColorForIso = useCallback((iso) => {
    //checks that countryColors exists and has an iso 
    if (countryColors && countryColors[iso]) {
      return countryColors[iso];
    }
    //default color  
    return '#ccc';
  }, [countryColors]);

  //style on the initial map render 
  const style = (feature) => ({
    fillColor: fillColorForIso(feature.properties.iso_a3),
    fillOpacity: 0.7,
    color: 'black',
    weight: 0.5
  });

  //adds a tooltip to each country 
  const onEachFeature = (feature, layer) => {
    layer.bindTooltip(feature.properties.name);
    //click trigger that gets iso and calls handle func  
    layer.on('click', () => {
      const iso = feature.properties.iso_a3;
      if (iso) {
        handleCountryClick(iso);
      }
      return;
    });
    //changes opacity on hover 
    layer.on('mouseover', () => {
      layer.setStyle({
        fillOpacity: 0.5
      });
    });

    layer.on('mouseout', () => {
      layer.setStyle({
        fillOpacity: 0.9
      });
    });
  };

  //async function used to fetch visa-data 
  const fetchVisaData = async (iso) => {
    try {
      const res = await fetch(`/api/v1/visa/visa-data/${iso}`);
      if (!res.ok) {
        throw new Error(`Server response: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error(error);
      //pass the error down 
      throw error;
    }
  };

  //async function that handles country click 
  const handleCountryClick = async (iso) => {
    try {
      //clears error state var 
      setError(null);
      const data = await fetchVisaData(iso);
      //sets the selected country
      setSelected(iso); 
      setVisaData(data);

      const updatedColors = {};
      //creates new objects 
      Object.entries(data.to).forEach(([countryIso, visaType]) => {
        let color = '';

        if (visaType === '-1') {
          color = selectedColor;
          //checks whether it can be correctly converted to a number
          //makes every number visa-free by default 
        } else if (!isNaN(Number(visaType))) {
          color = visaOptions.find((type) => type.label === 'visa free').color;
          //maps the visa status to a specific color 
        } else {
          // color = visaColors[visaType]
          const match = visaOptions.find((type) => type.label === visaType);

          if (match) {
            color = match.color;
          } else {
            color = 'gray';
          }
          
        }
        updatedColors[countryIso] = color;
      });
      //passing it to the main component, so it can be used in the CountryList 
      setCountryColors(updatedColors);
    } catch (error) {
      console.error(error);
      //resets to initial state 
      setVisaData(null);
      setCountryColors({}); 
      setSelected(null);
      setError('Could not retrieve visa data.');
    }
  };

  useEffect(() => {
    //geojson layer from leaflet 
    const layer = geoJsonRef.current;
    if (!layer){
      return;
    }
    //TODO: think about how I can remove code repetition 
    layer.setStyle((feature) => ({
      fillColor: fillColorForIso(feature.properties.iso_a3),
      fillOpacity: 0.7,
      color: 'black',
      weight: 0.5
    }));
  }, [countryColors, fillColorForIso]);

  return (
    <div className="map-container-elem">
      <MapContainer 
        center={[50, 0]}
        zoom={2}
        style={{ height: '80vh' }}
        scrollWheelZoom={false}
        doubleClickZoom={false}>
        {mapData &&
        <GeoJSON
          ref={geoJsonRef}
          data={mapData}
          style={style}
          onEachFeature={onEachFeature}
        />
        }
      </MapContainer>
    </div>
  );
}
