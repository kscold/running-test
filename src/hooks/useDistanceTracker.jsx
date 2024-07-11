// import { useState, useEffect, useCallback } from "react"

// const haversineDistance = (coords1, coords2) => {
//   const toRad = (value) => (value * Math.PI) / 180

//   const R = 6371 // km
//   const dLat = toRad(coords2.latitude - coords1.latitude)
//   const dLon = toRad(coords2.longitude - coords1.longitude)
//   const lat1 = toRad(coords1.latitude)
//   const lat2 = toRad(coords2.latitude)

//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

//   return R * c * 1000 // meter
// }

// export const useDistanceTracker = (initialLocation) => {
//   const [distance, setDistance] = useState(0)
//   const [previousLocation, setPreviousLocation] = useState(null)
//   const [path, setPath] = useState([])
//   const [initialized, setInitialized] = useState(false)

//   const updateDistance = useCallback(
//     (newLocation) => {
//       if (previousLocation) {
//         const dist = haversineDistance(previousLocation, newLocation)

//         // 10미터 이상의 이동만 반영
//         if (dist >= 10) {
//           setDistance((prevDistance) => prevDistance + dist)
//           setPreviousLocation(newLocation)

//           setPath((prevPath) => {
//             return [...prevPath, newLocation]
//           })

//           console.log("업데이트된 거리와 경로:", {
//             distance: dist,
//             newPath: path,
//           })
//         }
//       }
//     },
//     [previousLocation, path]
//   )

//   const resetDistance = useCallback((newLocation) => {
//     setDistance(0)
//     setPreviousLocation(newLocation)
//     setPath([newLocation])
//     setInitialized(true)
//   }, [])

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       if (initialized) {
//         navigator.geolocation.getCurrentPosition((pos) => {
//           updateDistance({
//             latitude: pos.coords.latitude,
//             longitude: pos.coords.longitude,
//           })
//         })
//         console.log(`거리: ${distance.toFixed(2)} m`)
//       }
//     }, 5000) // 5초마다 거리 계산

//     return () => clearInterval(intervalId)
//   }, [previousLocation, distance, initialized, updateDistance])

//   return { distance, path, updateDistance, resetDistance, initialized }
// }

import { useCallback, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateDistanceAndSteps } from "../redux/location"
import haversineDistance from "../utils/haversineDistance"

export const useDistanceTracker = () => {
  const location = useSelector((state) => state.location)
  const dispatch = useDispatch()
  const previousLocationRef = useRef(null)

  const updateDistance = useCallback(
    (newLocation) => {
      if (previousLocationRef.current) {
        const dist = haversineDistance(previousLocationRef.current, newLocation)
        const averageStepLength = 0.8

        if (dist >= 10 && dist < 100) {
          dispatch(
            updateDistanceAndSteps({
              distance: dist,
              steps: dist / averageStepLength,
            })
          )
          previousLocationRef.current = newLocation
        }
      } else {
        previousLocationRef.current = newLocation
      }
    },
    [dispatch]
  )

  const resetDistance = useCallback((newLocation) => {
    previousLocationRef.current = newLocation
  }, [])

  return {
    resetDistance,
    updateDistance,
    initialized: previousLocationRef.current !== null,
  }
}
