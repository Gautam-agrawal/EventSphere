import React, { useEffect, useState } from "react";
import {useJsApiLoader, GoogleMap, MarkerF, DirectionsRenderer} from "@react-google-maps/api"
import { ChakraProvider, SkeletonText } from "@chakra-ui/react"
import { MdDirectionsSubway, MdDirectionsWalk, MdOutlineDirectionsCar } from "react-icons/md";


export default function SimpleMap({userLatitude, userLongitude, latitude, longitude}){
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [mapIsLoaded, setMapIsLoaded] = useState(false);
  const {isLoaded,} = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBwHGfW0OI47YmyPmuel0Z0NlowAAI0eLw'
  })

  async function calculateRoute(e, mode) {
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: new google.maps.LatLng(userLatitude, userLongitude),
      destination: new google.maps.LatLng(latitude, longitude),
      travelMode: mode === 'DRIVING' ? google.maps.TravelMode.DRIVING : mode === 'TRANSIT' ? google.maps.TravelMode.TRANSIT : google.maps.TravelMode.WALKING,
    })
    setDirectionsResponse(results);
    setMapIsLoaded(true);
  }

  if (!isLoaded) {
    return <ChakraProvider><SkeletonText /></ChakraProvider>;
  }

  console.log("Rendering the map...");
  return (
    <div style={{ height: '52.5vh', width: '100%' }}>
        <GoogleMap
          center={{ lat: latitude, lng: longitude }}
          zoom={15}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          mapContainerStyle={{ width: '100%', height: '100%' }}
        >
          {userLatitude && userLatitude &&
          <div className="z-10 " style={{position: 'absolute'}}>
            <div class="inline-flex rounded-md shadow-sm" role="group">
              <button type="button" onClick={(e) => (calculateRoute(e, 'DRIVING'))} class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 focus:z-10 dark:bg-gray-700 active:bg-gray-100 focus:bg-gray-100 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:text-white">
              <MdOutlineDirectionsCar/>
              </button>
              <button type="button" onClick={(e) => (calculateRoute(e, 'TRANSIT'))} class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 focus:z-10 dark:bg-gray-700 active:bg-gray-100 focus:bg-gray-100 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:text-white">
              <MdDirectionsSubway/>
              </button>
              <button type="button" onClick={(e) => (calculateRoute(e, 'WALKING'))} class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 focus:z-10 dark:bg-gray-700 active:bg-gray-100 focus:bg-gray-100 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:text-white">
              <MdDirectionsWalk/>
              </button>
            </div>
          </div>}
          <MarkerF position={{ lat: latitude, lng: longitude }} />
          {userLatitude && userLatitude && directionsResponse &&
            <MarkerF icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 4,
          }} position={{ lat: userLatitude, lng: userLongitude }} />
          }
          <DirectionsRenderer directions={directionsResponse} />
        </GoogleMap>
    </div>
  );
}