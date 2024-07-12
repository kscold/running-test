// import { useGeoLocation } from "../hooks/useGeoLocation"
// import { useDistanceTracker } from "../hooks/useDistanceTracker"
// import { useEffect } from "react"
// import KakaoMap from "../components/KakaoMap"

// const Step = () => {
//   const {
//     location,
//     error: geoError,
//     requestLocation,
//   } = useGeoLocation({
//     enableHighAccuracy: true,
//     timeout: 1000 * 10,
//     maximumAge: 1000 * 3600 * 24,
//   })
//   const { distance, path, updateDistance, resetDistance, initialized } =
//     useDistanceTracker()

//   useEffect(() => {
//     if (location && !initialized) {
//       resetDistance(location)
//     } else if (location) {
//       updateDistance(location)
//     }
//   }, [location, initialized, updateDistance, resetDistance])

//   useEffect(() => {
//     requestLocation()
//   }, [])

//   if (geoError) return <div>{geoError}</div>

//   const averageStepLength = 0.8 // 평균 걸음 거리
//   const steps = distance / averageStepLength

//   return (
//     <div>
//       {location && (
//         <KakaoMap location={location} path={path} distance={distance} />
//       )}
//       <div>거리: {distance.toFixed(2)} m</div>
//       <div>약 걸음 수: {steps.toFixed(0)}</div>
//     </div>
//   )
// }

// export default Step

import { useGeoLocation } from "../hooks/useGeoLocation"
import { useDistanceTracker } from "../hooks/useDistanceTracker"
import { useEffect, useState, useRef } from "react"
import KakaoMap from "../components/KakaoMap"
import { useDispatch, useSelector } from "react-redux"
import { setLocation, resetLocation, setTrackingState } from "../redux/location"

const Step = () => {
  const { error, requestLocation, clearWatcher } = useGeoLocation({
    enableHighAccuracy: true,
    timeout: 1000 * 10,
    maximumAge: 1000 * 3600 * 24,
  })
  const location = useSelector((state) => state.location)
  const { resetDistance, updateDistance, initialized } = useDistanceTracker()
  const dispatch = useDispatch()
  const intervalRef = useRef(null)

  const handleStartTracking = () => {
    requestLocation()
    dispatch(setTrackingState(true))
  }

  const handleStopTracking = () => {
    clearInterval(intervalRef.current)
    clearWatcher()
    dispatch(resetLocation())
    dispatch(setTrackingState(false))
  }

  useEffect(() => {
    if (location.tracking) {
      if (location.latitude !== null && !initialized) {
        resetDistance(location)

        const simulateMovement = () => {
          let lat = location.latitude
          let lng = location.longitude

          intervalRef.current = setInterval(() => {
            // lat += 0.0001
            // lng += 0.0001
            dispatch(setLocation({ latitude: lat, longitude: lng }))
            updateDistance({ latitude: lat, longitude: lng })
          }, 5000)

          return () => clearInterval(intervalRef.current)
        }

        simulateMovement()
      }
    } else {
      clearInterval(intervalRef.current)
    }
  }, [
    location.tracking,
    location,
    initialized,
    resetDistance,
    updateDistance,
    dispatch,
  ])

  useEffect(() => {
    if (location.latitude !== null && initialized) {
      const lastPathPoint = location.path[location.path.length - 1]
      updateDistance(lastPathPoint)
    }
  }, [initialized, location, updateDistance])

  useEffect(() => {
    if (location.tracking) {
      handleStartTracking()
    }
  }, []) // Run once on component mount to check tracking state

  if (error) return <div>{error}</div>

  return (
    <div>
      {!location.tracking && (
        <button onClick={handleStartTracking}>산책 시작</button>
      )}
      {location.tracking && (
        <button onClick={handleStopTracking}>산책 종료</button>
      )}
      {location.latitude && (
        <>
          <KakaoMap
            location={location}
            path={location.path}
            distance={location.distance}
          />
          <div>거리: {location.distance.toFixed(2)} m</div>
          <div>약 걸음 수: {location.steps.toFixed(0)}</div>
        </>
      )}
    </div>
  )
}

export default Step
