/* eslint-disable */

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
  

dotenv.config();
const key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID;

const API_BASE = "http://localhost:80/api"
// const API_BASE = "back.stamped.photo/api"

export type LOI = { id : number, name : string, location: google.maps.LatLngLiteral }
export type POI = { id : number, locationName : string, name : string, description : string, location: google.maps.LatLngLiteral } 
export type Stamp = { id : number,
    user_name : string, 
    challenge_name : string, 
    location_name : string, 
    point_of_interest_name : string, 
    stamp : string,
    datetime : string,
    photolink : string
}

var locations: LOI[] = []
var points: POI[] = []

try {
    const locationsResponse = await fetch(`${API_BASE}/location/`, {
          method: 'GET',
        })
    
    const poiResponse = await fetch(`${API_BASE}/poi/`, {
        method: 'GET',
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
//      Bear, Inverted Fountain, Wooden Statue
// ]

// points: POI[] = [
//     {id: 1, locationId: 1, name: "Pauley Pavilion", description: "Code for a hackathon!", location: {lat: 34.070211, lng: -118.446775}}
// ]

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

    const [userStamps, setUserStamps] = useState(0);
    const [locationStamps, setLocationStamps] = useState(0);

    useEffect(() => {
        console.log("Changed detected")
        const fetchUserStamps = async () => {
            try {
                const user = localStorage.getItem("stamped-username")
                if (!user) {
                    alert("Please log in to submit a stamp.");
                    return;
                } 

                const userStampsResponse = await fetch(`${API_BASE}/stamp/getByUserAndLocation/` + user + '/' + props.locationName, {
                    method: 'GET',
                });

                if (userStampsResponse.ok) {
                    const userStampsInfo = await userStampsResponse.json() as Stamp[];
                    console.log("Successful User Stamps: " + userStampsInfo)
                    setUserStamps(userStampsInfo.length);
                } else {
                    console.log("Fetching stamps by username error.")
                }
            } catch (error) {
                console.log("Error occurred: " + error)
            }
        };

        const fetchLocationStamps = async () => {
            try {
                const locationStampsResponse = await fetch(`${API_BASE}/stamp/getByLocation/` + props.locationName, {
                    method: 'GET',
                })

                if (locationStampsResponse.ok) {
                    const locationStampsInfo = await locationStampsResponse.json() as Stamp[];
                    console.log("Successful Location Stamps: " + locationStampsInfo)
                    setLocationStamps(locationStampsInfo.length);
                } else {
                    console.log("Fetching stamps by location error.")
                }
            } catch (error) {
                console.log("Error occurred: " + error);
            }
        };

        fetchUserStamps();
        fetchLocationStamps();

    }, [props.locationName]);


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
          <div className="text-[10px] text-indigo-400">{'Stamps: ' + userStamps + '/' + locationStamps }</div>
        </div>
        <div className="text-xs text-indigo-600 font-bold text-center min-w-[2rem]">{(userStamps / locationStamps * 100).toFixed(1) + '%'}</div>
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
    const [hasStamped, setHasStamped] = useState(false);

    useEffect(() => {
        console.log("Changed detected")
        const fetchUserStamps = async () => {
            try {
                const user = localStorage.getItem("stamped-username")
                if (!user) {
                    alert("Please log in to submit a stamp.");
                    return;
                } 

                const userStampsResponse = await fetch(`${API_BASE}/stamp/getByUserAndLocation/` + user + '/' + props.loi.name, {
                    method: 'GET',
                });

                if (userStampsResponse.ok) {
                    const userStampsInfo = await userStampsResponse.json() as Stamp[];
                    console.log("Successful User Stamps: " + userStampsInfo)
                    setHasStamped(userStampsInfo.length > 0);;
                } else {
                    console.log("Fetching stamps by username error.")
                }
            } catch (error) {
                console.log("Error occurred: " + error)
            }
        };

        fetchUserStamps();

    }, []);

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
                fillColor={hasStamped ? '#23cc50':'#808080'}
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

function POIDisplay(props: { poi: POI }) {
    const poi = props.poi;
    const [data, setData] = useState<Stamp[]>([]);
    const [dataExists, setDataExists] = useState(false);

    useEffect(() => {
        const fetchStamps = async () => {
            try {
                const stampsResponse = await fetch(`${API_BASE}/stamp/getByPOI/` + poi.name, {
                    method: 'GET',
                });
                console.log('Successful stamps fetch.');
                const stampsInfo = (await stampsResponse.json()) as {
                    id: number;
                    user_name: string;
                    challenge_name: string;
                    location_name: string;
                    point_of_interest_name: string;
                    stamp: string;
                    datetime: string;
                    photolink: string;
                }[];
                setData(stampsInfo || []);
                setDataExists(stampsInfo.length > 0);
            } catch (error) {
                console.log('Error in fetching stamps.', error);
                setData([]);
                setDataExists(false);
            }
        };

        fetchStamps(); // Call the async function
    }, []); // Empty dependency array ensures this runs only once

    return (
        <div className="flex flex-col text-black gap-4">
            <div className="font-bold text-xl text-center">{props.poi.name}</div>
            <Carousel
                opts={{
                    align: 'center',
                    loop: true,
                    dragFree: true,
                }}
            >
                <CarouselContent>
                    {dataExists && data.map((stamp, index) => (
                        <CarouselItem key={index} className="overflow-hidden basis-1/2">
                            <div className="relative w-full h-20">
                                <Image
                                    src={stamp.photolink}
                                    alt={stamp.challenge_name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="rounded-lg"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                    {!dataExists && <div className='text-center text-xl p-5'>
                        Be the first to be Stamped!
                    </div>
                    }
                </CarouselContent>
            </Carousel>
            <div className="text-center">{props.poi.description}</div>
            <Upload poi={props.poi} />
        </div>
    );
}

export default MapDisplay;