// import { useEffect } from "react"
// import { useGeoLocation } from "../hooks/useGeoLocation"
// import { useDistanceTracker } from "../hooks/useDistanceTracker"
// import Map from "../components/Map"

// const geolocationOptions = {
//   enableHighAccuracy: true,
//   timeout: 1000 * 10,
//   maximumAge: 1000 * 3600 * 24,
// }

// const Step = () => {
//   const { location, error: geoError } = useGeoLocation(geolocationOptions)
//   const { distance, path, updateDistance } = useDistanceTracker(location)

//   useEffect(() => {
//     if (location) {
//       updateDistance(location)
//     }
//   }, [location])

//   if (geoError) return <div>{geoError}</div>
//   if (!location) return <div>로딩중...</div>

//   const averageStepLength = 0.8 // 평균 걸음 거리
//   const steps = distance / averageStepLength

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
//       <div>거리: {distance.toFixed(2)} m</div>
//       <div>약 걸음 수: {steps.toFixed(0)}</div>
//     </div>
//   )
// }

// export default Step

import { useGeoLocation } from "../hooks/useGeoLocation"
import { useDistanceTracker } from "../hooks/useDistanceTracker"
import { useEffect } from "react"
import KakaoMap from "../components/KakaoMap"

const Step = () => {
  const {
    location,
    error: geoError,
    requestLocation,
  } = useGeoLocation({
    enableHighAccuracy: true,
    timeout: 1000 * 10,
    maximumAge: 1000 * 3600 * 24,
  })
  const { distance, path, updateDistance } = useDistanceTracker(location)

  useEffect(() => {
    if (location) {
      updateDistance(location)
    }
  }, [location])

  if (geoError) return <div>{geoError}</div>

  const handleLocationRequest = () => {
    requestLocation()
  }

  if (!location)
    return <button onClick={handleLocationRequest}>Get Location</button>

  const averageStepLength = 0.8 // 평균 걸음 거리
  const steps = distance / averageStepLength

  return (
    <div>
      <div>
        <KakaoMap location={location} path={path} />
      </div>
      <div>거리: {distance.toFixed(2)} m</div>
      <div>약 걸음 수: {steps.toFixed(0)}</div>
    </div>
  )
}

export default Step
