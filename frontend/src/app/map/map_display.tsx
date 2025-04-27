'use client'

import {APIProvider, Map, MapCameraChangedEvent, AdvancedMarker, Pin, useAdvancedMarkerRef, InfoWindow, MapControl, ControlPosition } from '@vis.gl/react-google-maps';
import dotenv from 'dotenv';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image'
import clsx from 'clsx';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { MdHeight } from 'react-icons/md';
import { Button } from '@/components/ui/button';

import { Circle } from './circle'
import Upload from './upload'
  

// TODO: create utils folder with functions, import and fetch LOIs from the database

dotenv.config();
const key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID;

export type LOI = { id : number, name : string, location: google.maps.LatLngLiteral }
export type POI = { id : number, locationName : string, name : string, description : string, location: google.maps.LatLngLiteral } 

var locations: LOI[] = []
var points: POI[] = []

try {
    const locationsResponse = await fetch('http://localhost:80/api/location/', {
          method: 'GET',
          mode: "no-cors"
        })
    
    const poiResponse = await fetch('http://localhost:80/api/poi/', {
        method: 'GET',
        mode: "no-cors"
        })

    if (locationsResponse.ok) {
        console.log("Successful locations fetch.")
        const locationsInfo = await locationsResponse.json() as { id : number, name : string, latitude : number, longitude : number}[]
        locations = locationsInfo.map(location => (
            {
                id: location.id,
                name: location.name,
                location : {
                    lat : location.latitude,
                    lng : location.longitude
                }
            }
        ))
        
    } else {
        console.log("Unsuccessful locations fetch.")
    }

    if (poiResponse.ok) {
        console.log("Successful POIs fetch.")
        const poiInfo = await poiResponse.json() as { id : number, location_name : string, name : string, description : string, latitude : number, longitude : number}[]
        points = poiInfo.map(poi => (
            { id : poi.id, locationName : poi.location_name, name : poi.name, description : poi.description, location : { lat : poi.latitude, lng : poi.longitude }}
        ))
        
        
    } else {
        console.log("Unsuccessful POI fetch.")
    }

} catch (error) {

}

//  locations = [
//     {id: 1, name: "UCLA", location: { lat: 34.0722, lng: -118.4427}},
//     {id: 2, name: "Santa Monica", location: { lat: 34.0119, lng: -118.4916}},
//     {id: 3, name: "Hollywood", location: { lat: 34.0907, lng: -118.3266}},
//     {id: 4, name: "Malibu", location: { lat: 34.0381, lng: -118.6923}},
//     {id: 5, name: "Silver Lake", location: { lat: 34.0829, lng: -118.2733}}
// ]

// points: POI[] = [
//     {id: 1, locationId: 1, name: "Pauley Pavilion", description: "Code for a hackathon!", location: {lat: 34.070211, lng: -118.446775}}
// ]

const images: string[] = [
    "https://drive.google.com/thumbnail?sz=w640&id=1NoM7_m0Eruab87d2qJYgZOxbYGd5XUHU",
    "https://drive.google.com/thumbnail?sz=w640&id=1NoM7_m0Eruab87d2qJYgZOxbYGd5XUHU",
    "https://drive.google.com/thumbnail?sz=w640&id=1NoM7_m0Eruab87d2qJYgZOxbYGd5XUHU",
    "https://drive.google.com/thumbnail?sz=w640&id=1NoM7_m0Eruab87d2qJYgZOxbYGd5XUHU",
    "https://drive.google.com/thumbnail?sz=w640&id=1NoM7_m0Eruab87d2qJYgZOxbYGd5XUHU",
    "https://drive.google.com/thumbnail?sz=w640&id=1NoM7_m0Eruab87d2qJYgZOxbYGd5XUHU",
]

const MapDisplay = () => {
    const [showLocationDisplay, setShowLocationDisplay] = useState(false);
    const [currentLocation, setCurrentLocation] = useState('');
    const [currentLocationId, setCurrentLocationId] = useState(-1);

    const checkLocation = useCallback((ev: MapCameraChangedEvent) => {
        for (var loi of locations) {
            if (Math.sqrt(
                Math.pow((loi as unknown as LOI).location.lat - ev.detail.center.lat, 2) + 
                Math.pow((loi as unknown as LOI).location.lng - ev.detail.center.lng, 2)) 
                < 0.01100 &&
                ev.detail.zoom > 14
                ) {
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
function LocationDisplay(props: { locationName: string }) {
    return (
      <div
        className={clsx(
          "absolute",
          "top-0",
          "right-2",
          "scale-95",
          "z-20", // ensures it's above the map
          "flex items-center gap-3 bg-white/90 px-3 py-1.25 rounded-xl shadow-md border border-indigo-200"
        )}
        style={{
          minWidth: 0,
          maxWidth: 210,
        }}
      >
        <div
          className="w-8 h-8 flex items-center justify-center rounded-full text-base font-bold bg-indigo-50 text-indigo-600 shadow-sm"
          aria-hidden
        >
          📍
        </div>
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <div className="text-[11px] font-semibold text-indigo-700 truncate">{props.locationName}</div>
          <div className="text-[10px] text-indigo-400">Stamps: 0/11</div>
        </div>
        <div className="text-xs text-indigo-600 font-bold text-center min-w-[2rem]">11%</div>
      </div>
    );
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
                fillColor={'#808080'}
                fillOpacity={props.transparent ? 0 : 0.2}
            / >
        </AdvancedMarker>
    )
}

function POIMarkers() {
    return (
        <>
            {points.map((poi : POI) => (
                <POIMarker key={poi.id} poi={poi} />
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
                <InfoWindow
                    style={{ height: '230px', width: '220px' }}
                    anchor={marker}
                    onClose={handleClose}
                >
                    <POIDisplay poi={props.poi} />
                </InfoWindow>
            )}
        </AdvancedMarker>
    )
}

function POIDisplay(props: {poi: POI}) {

    return(
        <div className='flex flex-col text-black gap-4'>
            <div className='font-bold text-xl'>{props.poi.name}</div>
            <Carousel
                opts={{
                    align: "center",
                    loop: true,
                    dragFree: true
                  }}
                
            >
                <CarouselContent>
                    {images.map((image, index) => (
                        <CarouselItem key={index} className='overflow-hidden basis-1/2'>
                            <div className="relative w-full h-20">
                                <Image
                                    src={image}
                                    alt={image}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="rounded-lg"
                                />
                            </div>
                        </CarouselItem>
                    ))

                    }
                </CarouselContent>
            </Carousel>
            <div className='text-center'>{props.poi.description}</div>
            <Upload poi={props.poi} />
        </div>
    )
}

export default MapDisplay;