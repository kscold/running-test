// // pages/Weather.js
// import { useState, useEffect } from "react"
// import { useGeoLocation } from "../hooks/useGeoLocation"
// import { useDistanceTracker } from "../hooks/useDistanceTracker"
// import Map from "../components/Map"

// const geolocationOptions = {
//   enableHighAccuracy: true,
//   timeout: 1000 * 10,
//   maximumAge: 1000 * 3600 * 24,
// }

// const Weather = () => {
//   const { location, error: geoError } = useGeoLocation(geolocationOptions)
//   const { distance, steps, updateDistance } = useDistanceTracker(location)
//   const [path, setPath] = useState([])

//   useEffect(() => {
//     if (location) {
//       setPath((prevPath) => [
//         ...prevPath,
//         [location.latitude, location.longitude],
//       ])
//       updateDistance(location)
//     }
//   }, [location])

//   if (geoError) return <div>{geoError}</div>
//   if (!location) return <div>Loading...</div>

//   return (
//     <div>
//       <div>
//         <Map
//           location={[location.latitude, location.longitude]}
//           path={path}
//           mapHeight={200}
//           mapWidth={200}
//         />
//       </div>
//       <div>Steps: {steps}</div>
//       <div>Distance: {distance.toFixed(2)} meters</div>
//     </div>
//   )
// }

// export default Weather

// pages/Weather.js
import { useState, useEffect } from "react"
import { useGeoLocation } from "../hooks/useGeoLocation"
import { useDistanceTracker } from "../hooks/useDistanceTracker"
import Map from "../components/Map"

const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 10,
  maximumAge: 1000 * 3600 * 24,
}

const Weather = () => {
  const { location, error: geoError } = useGeoLocation(geolocationOptions)
  const { distance, updateDistance } = useDistanceTracker(location)
  const [path, setPath] = useState([])

  useEffect(() => {
    if (location) {
      setPath((prevPath) => [
        ...prevPath,
        [location.latitude, location.longitude],
      ])
      updateDistance(location)
    }
  }, [location])

  if (geoError) return <div>{geoError}</div>
  if (!location) return <div>Loading...</div>

  const averageStepLength = 0.8 // meters
  const steps = distance / averageStepLength

  return (
    <div>
      <div>
        <Map
          location={[location.latitude, location.longitude]}
          path={path}
          mapHeight={200}
          mapWidth={200}
        />
      </div>
      <div>거리: {distance.toFixed(2)} meters</div>
      <div>평균 걸음: {steps.toFixed(0)}</div>
    </div>
  )
}

export default Weather
