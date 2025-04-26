'use client'

import {APIProvider, Map, MapCameraChangedEvent, AdvancedMarker, Pin, useAdvancedMarkerRef, InfoWindow, MapControl, ControlPosition } from '@vis.gl/react-google-maps';
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
type POI = { id : number, locationId : number, name : string, description : string, location: google.maps.LatLngLiteral } // TODO: add photos component

const locations: LOI[] = [
    {id: 1, name: "UCLA", location: { lat: 34.0722, lng: -118.4427}},
    {id: 2, name: "Santa Monica", location: { lat: 34.0119, lng: -118.4916}},
    {id: 3, name: "Hollywood", location: { lat: 34.0907, lng: -118.3266}},
    {id: 4, name: "Malibu", location: { lat: 34.0381, lng: -118.6923}},
    {id: 5, name: "Silver Lake", location: { lat: 34.0829, lng: -118.2733}}
]

const points: POI[] = [
    {id: 1, locationId: 1, name: "Pauley Pavilion", description: "Code for a hackathon!", location: {lat: 34.070211, lng: -118.446775}}
]

const MapDisplay = () => {
    const [showLocationDisplay, setShowLocationDisplay] = useState(false);
    const [currentLocation, setCurrentLocation] = useState('');
    const [currentLocationId, setCurrentLocationId] = useState(-1);

    const checkLocation = useCallback((ev: MapCameraChangedEvent) => {
        for (var loi of locations) {
            if (Math.sqrt(Math.pow((loi as unknown as LOI).location.lat - ev.detail.center.lat, 2) + Math.pow((loi as unknown as LOI).location.lng - ev.detail.center.lng, 2)) < 0.01100) {
                setShowLocationDisplay(true);
                setCurrentLocation((loi as unknown as LOI).name);
                setCurrentLocationId((loi as unknown as LOI).id)
                console.log(showLocationDisplay);
                return;
            }
        }
        setShowLocationDisplay(false);
        setCurrentLocation('');
        setCurrentLocationId(-1)
    }, [])

    // TODO: LocationDisplay needs to update after one of its props changes

    return(
        <div className='relative w-full'>
            <APIProvider apiKey={key ?? ''} onLoad={() => console.log('Maps API has loaded.')}>
                <Map
                    style={{ height: '100vh', width: '100%' }}
                    defaultZoom={10}
                    defaultCenter={ { lat: 34.0549, lng: -118.2426 } }
                    mapId={mapId ?? ''}
                    onCameraChanged={ checkLocation }
                    streetViewControl={false}
                    fullscreenControl={false}
                >
                    <LOIMarkers currentLocationId={currentLocationId}/>
                    <POIMarkers />
                </Map>
            </APIProvider>
            <div className='absolute top-4 right-4'>
                {showLocationDisplay && <LocationDisplay locationName={currentLocation} />} 
            </div>
        </div>
        
    )
}


// TODO: make it so that it fetches from the DB using location id instead
function LocationDisplay(props: {locationName: string}) {
    return (
        <div className='text-black bg-white border border-violet-400 rounded-lg p-10'>
            <div>Location: {props.locationName}</div>
            <div>Stamps: 0/11</div>
            <div className='text-xl text-center'>11%</div>
        </div>
    )
}


function LOIMarkers(props: {currentLocationId: number}) {
    return (
        <>
            {locations.map( (loi : LOI) => (
                <LOIMarker key={loi.id} loi={loi} transparent={loi.id == props.currentLocationId ? true : false} />
            ))}
        </>
    )
}

function LOIMarker(props: {loi: LOI, transparent: boolean}) {
    const [markerRef, marker] = useAdvancedMarkerRef();

    return (
        <AdvancedMarker
            key={props.loi.id}
            ref={markerRef}
            position={props.loi.location}
        >
            <Circle 
                radius={1100}
                center={props.loi.location}
                strokeColor={'#0c4cb3'}
                strokeOpacity={1}
                strokeWeight={3}
                fillColor={'#3b82f6'}
                fillOpacity={props.transparent ? 0 : 0.2}
            / >
        </AdvancedMarker>
    )
}

function POIMarkers() {
    return (
        <>
            {points.map((poi : POI) => (
                <POIMarker key={poi.locationId + 0.1 * poi.id} poi={poi} />
            ))}
        </>
    )
}

function POIMarker(props: {poi: POI}) {
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [infoWindowShown, setInfoWindowShown] = useState(false);

    const handleMarkerClick = useCallback(
        () => setInfoWindowShown(isShown => !isShown),
        []
    )

    const handleClose = useCallback(() => setInfoWindowShown(false), []);

    return(
        <AdvancedMarker
            onClick = {handleMarkerClick}
            key={props.poi.id}
            ref={markerRef}
            position={props.poi.location}
        >
            <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
            {infoWindowShown && (
                <InfoWindow anchor={marker} onClose={handleClose}>
                    <POIDisplay poi={props.poi} />
                </InfoWindow>
            )}
        </AdvancedMarker>
    )
}

function POIDisplay(props: {poi: POI}) {

    // TODO: add photos to first flex-row div
    return(
        <div className='flex flex-col text-black'>
            <div className='flex flex-row'></div>
            <div className=''>
                {props.poi.description}
            </div>
        </div>
    )
}

export default MapDisplay;