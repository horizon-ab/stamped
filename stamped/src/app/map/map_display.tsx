'use client'

import {APIProvider, Map, MapCameraChangedEvent, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import dotenv from 'dotenv';
import { useEffect, useRef} from 'react';

// TODO: create utils folder with functions, import and fetch POIs from the database

dotenv.config();
const key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID;
console.log(key)
console.log(mapId)

type POI = { id : number, name : string, location: google.maps.LatLngLiteral }
const locations: POI[] = [
    {id: 1, name: "ucla", location: { lat: 34.0722, lng: -118.4427}}
]

const MapDisplay = () => {

    return(
        <APIProvider apiKey={key ?? ''} onLoad={() => console.log('Maps API has loaded.')}>
            <Map
                style={{ height: '100vh', width: '100%' }}
                defaultZoom={13}
                defaultCenter={ { lat: 34.0549, lng: -118.2426 } }
                mapId={mapId ?? ''}
                onCameraChanged={ (ev: MapCameraChangedEvent) =>
                  console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                }
            >
                <POIMarkers locations={locations}/>
            </Map>
        </APIProvider>
    )
}

// 34.0549° N, 118.2426° W


function POIMarkers(props: {locations: POI[]}) {
    return (
        <>
            {props.locations.map( (poi : POI) => (
                <AdvancedMarker
                    key={poi.id}
                    position={poi.location}
                >
                    <Pin background={'#00FF00'} glyphColor={'#000'} borderColor={'#000'} />
                </AdvancedMarker>
                
            ))}
        </>
    )
}

export default MapDisplay