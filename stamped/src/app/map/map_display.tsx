'use client'

import {APIProvider, Map, MapCameraChangedEvent, AdvancedMarker, Pin, useAdvancedMarkerRef, InfoWindow } from '@vis.gl/react-google-maps';
import dotenv from 'dotenv';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Circle }from './circle'

// TODO: create utils folder with functions, import and fetch LOIs from the database

dotenv.config();
const key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID;
console.log(key)
console.log(mapId)

type LOI = { id : number, name : string, location: google.maps.LatLngLiteral }


const locations: LOI[] = [
    {id: 1, name: "UCLA", location: { lat: 34.0722, lng: -118.4427}},
    {id: 2, name: "Santa Monica", location: { lat: 34.0119, lng: -118.4916}},
    {id: 3, name: "Hollywood", location: { lat: 34.0907, lng: -118.3266}},
    {id: 4, name: "Malibu", location: { lat: 34.0381, lng: -118.6923}},
    {id: 5, name: "Silver Lake", location: { lat: 34.0829, lng: -118.2733}}
]

const MapDisplay = () => {

    return(
        <APIProvider apiKey={key ?? ''} onLoad={() => console.log('Maps API has loaded.')}>
            <Map
                style={{ height: '100vh', width: '100%' }}
                defaultZoom={10}
                defaultCenter={ { lat: 34.0549, lng: -118.2426 } }
                mapId={mapId ?? ''}
                onCameraChanged={ (ev: MapCameraChangedEvent) =>
                  console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                }
            >
                <LOIMarkers locations={locations}/>
            </Map>
        </APIProvider>
    )
}

// 34.0549° N, 118.2426° W


function LOIMarkers(props: {locations: LOI[]}) {
    return (
        <>
            {props.locations.map( (loi : LOI) => (
                <LOIMarker loi={loi} />
            ))}
        </>
    )
}

function LOIMarker(props: {loi: LOI}) {
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [infoWindowShown, setInfoWindowShown] = useState(false);

    const handleMarkerClick = useCallback(
        () => setInfoWindowShown(isShown => !isShown),
        []
    )

    const handleClose = useCallback(() => setInfoWindowShown(false), []);

    return (
        <AdvancedMarker
            key={props.loi.id}
            ref={markerRef}
            position={props.loi.location}
            onClick={handleMarkerClick}
        >
            {/* <Pin background={'#00FF00'} glyphColor={'#000'} borderColor={'#000'} />
            {infoWindowShown && (
                <InfoWindow anchor={marker} onClose={handleClose}>
                    <div className='text-black'>List LOIs and descriptions/photos/other people stuff</div>
                </InfoWindow>
            )} */}
            <Circle 
                onClick = {handleMarkerClick} // TODO: scuffed, fix later
                radius={1100}
                center={props.loi.location}
                strokeColor={'#0c4cb3'}
                strokeOpacity={1}
                strokeWeight={3}
                fillColor={'#3b82f6'}
                fillOpacity={0.2}
            / >
            {infoWindowShown && (
                <InfoWindow anchor={marker} onClose={handleClose}>
                    <div className='text-black'>List LOIs and descriptions/photos/other people stuff</div>
                </InfoWindow>
            )}
        </AdvancedMarker>
    )
}

export default MapDisplay