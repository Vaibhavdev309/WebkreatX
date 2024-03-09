import React, { useRef, useState } from "react";
import axios from "axios";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

const FindRide = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places", "geometry"],
  });
  const [directionsResponse, setDirectionResponse] = useState(null);
  const [map, setMap] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const originRef = useRef();
  const destinationRef = useRef();
  const dateTimeRef = useRef();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const center = { lat: 48.8584, lng: 2.2945 };

  const serachRide = async () => {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }

    const origin = originRef.current.value;
    const destination = destinationRef.current.value;
    const dateTime = new Date(dateTimeRef.current.value);
    const date = dateTime.toISOString().slice(0, 10);

    try {
      // Send request to backend
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/rides/getAvaliableRides`,
        { origin, destination, date }
      );

      if (response.status === 200) {
        console.log("Available rides:", response.data);

        // Parse the overview polyline from the backend response
        const { overview_polyline } = response.data[0];
        const routeCoordinates =
          google.maps.geometry.encoding.decodePath(overview_polyline);

        // Geocode source and destination addresses to get their coordinates
        const geocoder = new google.maps.Geocoder();
        const sourceResult = await geocoder.geocode({ address: origin });
        const destinationResult = await geocoder.geocode({
          address: destination,
        });

        const sourceLatLng = sourceResult.results[0].geometry.location;
        const destinationLatLng =
          destinationResult.results[0].geometry.location;

        // Check if the source and destination points are on the route
        const isSourceOnRoute = routeCoordinates.some((point) => {
          const distance =
            google.maps.geometry.spherical.computeDistanceBetween(
              point,
              sourceLatLng
            );
          return distance < 1000; // Define your threshold distance here
        });

        const isDestinationOnRoute = routeCoordinates.some((point) => {
          const distance =
            google.maps.geometry.spherical.computeDistanceBetween(
              point,
              destinationLatLng
            );
          return distance < 10000; // Define your threshold distance here
        });

        if (isSourceOnRoute && isDestinationOnRoute) {
          console.log("Both source and destination points are on the route.");

          // Calculate route between source and destination
          const directionsService = new google.maps.DirectionsService();
          directionsService.route(
            {
              origin: origin,
              destination: destination,
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                setDirectionResponse(result);
              } else {
                console.error(`Directions request failed due to ${status}`);
              }
            }
          );
        } else {
          console.log(
            "Either source or destination point is not on the route."
          );
        }
      } else {
        console.error("Failed to fetch available rides");
        // Handle error
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  const clearRoute = () => {
    setDirectionResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  };

  return (
    <div className="relative flex items-center flex-col h-screen w-screen">
      <div className="absolute inset-0">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(loaded) => setMap(loaded)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
      <div className="z-10">
        <Autocomplete>
          <input
            type="text"
            placeholder="Origin"
            ref={originRef}
            className="border"
          />
        </Autocomplete>

        <Autocomplete>
          <input
            type="text"
            placeholder="Destination"
            ref={destinationRef}
            className="border"
          />
        </Autocomplete>

        <input
          type="datetime-local"
          placeholder="Date and time"
          ref={dateTimeRef}
          className="border"
        />

        <button
          className="bg-gray-300 p-2 rounded-full"
          onClick={() => {
            map.panTo(center);
          }}
        >
          Add Icon
        </button>
        <button className="bg-gray-300 p-2 rounded-full" onClick={serachRide}>
          Search Ride
        </button>
        <button className="bg-gray-300 p-2 rounded-full" onClick={clearRoute}>
          Clear Search
        </button>
      </div>
    </div>
  );
};

export default FindRide;

// import React, { useRef, useState } from "react";
// import {
//   useJsApiLoader,
//   GoogleMap,
//   Marker,
//   Autocomplete,
//   DirectionsRenderer,
// } from "@react-google-maps/api";

// const FindRide = () => {
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY,
//     libraries: ["places", "geometry"],
//   });
//   const [directionsResponse, setDirectionResponse] = useState(null);
//   const [map, setMap] = useState(null);
//   const [distance, setDistance] = useState("");
//   const [duration, setDuration] = useState("");
//   const originRef = useRef();
//   const checkRef = useRef();
//   const destinationRef = useRef();

//   if (!isLoaded) {
//     return <div>Loading...</div>;
//   }

//   const center = { lat: 48.8584, lng: 2.2945 };
//   const handleCheckLocation = () => {
//     const location = checkRef.current.value;
//     if (!location) return;

//     const geocoder = new google.maps.Geocoder();
//     geocoder.geocode({ address: location }, (results, status) => {
//       if (status === "OK" && results[0]) {
//         const { lat, lng } = results[0].geometry.location;

//         if (!directionsResponse) {
//           console.log("Please calculate route first.");
//           return;
//         }

//         const routePath = directionsResponse.routes[0].overview_path;
//         const isLocationOnRoute = routePath.some((point) => {
//           const distance =
//             google.maps.geometry.spherical.computeDistanceBetween(
//               point,
//               new google.maps.LatLng(lat(), lng())
//             );
//           return distance < 10000; // Define your threshold distance here
//         });

//         if (isLocationOnRoute) {
//           console.log("Location is on the route.");

//           // Calculate time to reach the specified location
//           const distanceToLocation =
//             google.maps.geometry.spherical.computeDistanceBetween(
//               new google.maps.LatLng("25.3176", "82.9739"),
//               new google.maps.LatLng(lat(), lng())
//             );
//           console.log(distanceToLocation);
//           // Assuming average speed in meters per second
//           const averageSpeed = 10; // meters per second
//           const timeToReachInSeconds = distanceToLocation / averageSpeed;

//           // Convert time to milliseconds and add to current time
//           const currentTime = new Date().getTime();
//           const arrivalTime = new Date(
//             currentTime + timeToReachInSeconds * 1000
//           );
//           console.log("Estimated arrival time:", arrivalTime);
//         } else {
//           console.log("Location is not on the route.");
//         }
//       } else {
//         console.log(
//           "Geocode was not successful for the following reason:",
//           status
//         );
//       }
//     });
//   };

//   const serachRide = async () => {
//     if (originRef.current.value === "" || destinationRef.current.value === "") {
//       return;
//     }

//     const origin = originRef.current.value;
//     const destination = destinationRef.current.value;

//     const directionService = new google.maps.DirectionsService();
//     const results = await directionService.route({
//       origin,
//       destination,
//       travelMode: google.maps.TravelMode.DRIVING,
//       provideRouteAlternatives: true, // Request multiple routes
//     });

//     const { routes } = results;
//     if (routes && routes.length > 0) {
//       let shortestRouteIndex = 0;
//       let shortestRouteDuration = routes[0].legs[0].duration.value;

//       // Find the route with the shortest duration
//       routes.forEach((route, index) => {
//         const routeDuration = route.legs[0].duration.value;
//         if (routeDuration < shortestRouteDuration) {
//           shortestRouteIndex = index;
//           shortestRouteDuration = routeDuration;
//         }
//       });

//       // Store the most optimum route in an array
//       const optimumRoute = routes[shortestRouteIndex];
//       console.log("The most optimum route is ", optimumRoute);

//       // Extract place names from the most optimum route
//       const placeNames = optimumRoute.legs.map((leg) => leg.end_address);
//       console.log("Places along the most optimum route:", placeNames);

//       // Draw all routes on the map
//       routes.forEach((route, index) => {
//         new google.maps.Polyline({
//           path: route.overview_path,
//           strokeColor: index === shortestRouteIndex ? "#FF0000" : "#0000FF", // Different color for the most optimum route
//           strokeOpacity: 0.8,
//           strokeWeight: 5,
//           map: map,
//         });
//       });

//       // Set distance and duration for the most optimum route
//       const { legs } = optimumRoute;
//       if (legs && legs.length > 0) {
//         const { distance, duration } = legs[0];
//         setDistance(distance.text);
//         setDuration(duration.text);
//       }
//     }

//     setDirectionResponse(results);
//   };

//   const clearRoute = () => {
//     setDirectionResponse(null);
//     setDistance("");
//     setDuration("");
//     originRef.current.value = "";
//     destinationRef.current.value = "";
//   };

//   return (
//     <div className="relative flex items-center flex-col h-screen w-screen">
//       <div className="absolute inset-0">
//         <GoogleMap
//           center={center}
//           zoom={15}
//           mapContainerStyle={{ width: "100%", height: "100%" }}
//           options={{
//             zoomControl: false,
//             streetViewControl: false,
//             mapTypeControl: false,
//             fullscreenControl: false,
//           }}
//           onLoad={(loaded) => setMap(loaded)}
//         >
//           <Marker position={center} />
//           {directionsResponse && (
//             <DirectionsRenderer directions={directionsResponse} />
//           )}
//         </GoogleMap>
//       </div>
//       <div className="z-10">
//         <Autocomplete>
//           <input
//             type="text"
//             placeholder="Origin"
//             ref={originRef}
//             className="border"
//           />
//         </Autocomplete>

//         <Autocomplete>
//           <input
//             type="text"
//             placeholder="Destination"
//             ref={destinationRef}
//             className="border"
//           />
//         </Autocomplete>

//         <button
//           className="bg-gray-300 p-2 rounded-full"
//           onClick={() => {
//             map.panTo(center);
//           }}
//         >
//           Add Icon
//         </button>
//         <button
//           className="bg-gray-300 p-2 rounded-full"
//           onClick={serachRide}
//         >
//           Search Ride
//         </button>
//         <button className="bg-gray-300 p-2 rounded-full" onClick={clearRoute}>
//           Clear Search
//         </button>
//         <Autocomplete>
//           <input
//             type="text"
//             placeholder="Enter Location"
//             ref={checkRef}
//             className="border"
//           />
//         </Autocomplete>

//         <button
//           className="bg-blue-500 text-white p-2 rounded-md"
//           onClick={handleCheckLocation}
//         >
//           Check Location
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FindRide;
