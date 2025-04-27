import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';

export default function MapWithBounds() {
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    const fetchBounds = async () => {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=San+Francisco&key=AIzaSyDoK3owtqGo-O4apQg40khuCaJiePFvZHA`);
      const data = await response.json();
      const viewport = data.results[0].geometry.bounds;
      setBounds(viewport);
    };

    fetchBounds();
  }, []);

  return (
    <div className="relative w-full h-[400px]">
      <APIProvider apiKey="AIzaSyDoK3owtqGo-O4apQg40khuCaJiePFvZHA">
        {bounds && (
          <Map
            bounds={{
              north: bounds.northeast.lat,
              south: bounds.southwest.lat,
              east: bounds.northeast.lng,
              west: bounds.southwest.lng,
            }}
            style={{ width: '100%', height: '100%' }}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
            }}
          />
        )}
      </APIProvider>
    </div>
  );
}
