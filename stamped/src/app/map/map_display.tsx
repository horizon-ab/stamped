'use client'

import {APIProvider, Map, MapCameraChangedEvent, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import dotenv from 'dotenv';
import { useEffect, useRef} from 'react';

// TODO: create utils folder with functions, import and fetch POIs from the database

type POI = { key : string, location: google.maps.LatLngLiteral }
dotenv.config();
const key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID;
console.log(key)
console.log(mapId)

// const locations: POI[] = [
//     {key: 'operaHouse', location: { lat: -33.8567844, lng: 151.213108  }},
//     {key: 'tarongaZoo', location: { lat: -33.8472767, lng: 151.2188164 }},
//     {key: 'manlyBeach', location: { lat: -33.8209738, lng: 151.2563253 }},
//     {key: 'hyderPark', location: { lat: -33.8690081, lng: 151.2052393 }},
//     {key: 'theRocks', location: { lat: -33.8587568, lng: 151.2058246 }},
//     {key: 'circularQuay', location: { lat: -33.858761, lng: 151.2055688 }},
//     {key: 'harbourBridge', location: { lat: -33.852228, lng: 151.2038374 }},
//     {key: 'kingsCross', location: { lat: -33.8737375, lng: 151.222569 }},
//     {key: 'botanicGardens', location: { lat: -33.864167, lng: 151.216387 }},
//     {key: 'museumOfSydney', location: { lat: -33.8636005, lng: 151.2092542 }},
//     {key: 'maritimeMuseum', location: { lat: -33.869395, lng: 151.198648 }},
//     {key: 'kingStreetWharf', location: { lat: -33.8665445, lng: 151.1989808 }},
//     {key: 'aquarium', location: { lat: -33.869627, lng: 151.202146 }},
//     {key: 'darlingHarbour', location: { lat: -33.87488, lng: 151.1987113 }},
//     {key: 'barangaroo', location: { lat: - 33.8605523, lng: 151.1972205 }},
// ]

const MapDisplay = () => {

    return(
        <APIProvider apiKey={key ?? ''} onLoad={() => console.log('Maps API has loaded.')}>
            <Map
                style={{ height: '100vh', width: '100%' }}
                defaultZoom={13}
                defaultCenter={ { lat: -33.860664, lng: 151.208138 } }
                mapId={mapId ?? ''}
                onCameraChanged={ (ev: MapCameraChangedEvent) =>
                  console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                }
            />
        </APIProvider>
    )
}


// function POIMarkers(props: {locations: POI[]}) {
//     return (
//         <>
//             {props.locations.map( (poi : POI) => (
//                 <AdvancedMarker
//                     key={poi.key}
//                     position={poi.location}
//                 >
//                     <Pin background={'#00FF00'} glyphColor={'#000'} borderColor={'#000'} />
//                 </AdvancedMarker>
                
//             ))}
//         </>
//     )
// }

export default MapDisplay