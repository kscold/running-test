// import { useState, useEffect, useRef, useCallback } from "react"
// import { useDispatch } from "react-redux"
// import { setLocation, updateDistanceAndSteps } from "../redux/location"
// import haversineDistance from "../utils/haversineDistance"

// /**
//  * movemontServcie를 Custom Hooks화 중에 있음
//  */

// const useMovement = () => {
//   const dispatch = useDispatch()
//   const intervalRef = useRef(null)
//   const [currentLocation, setCurrentLocation] = useState(null)

//   const startMovement = useCallback(() => {
//     intervalRef.current = setInterval(() => {
//       setCurrentLocation((prevLocation) => {
//         if (prevLocation) {
//           let lat = prevLocation.latitude
//           let lng = prevLocation.longitude

//           // 테스트 이동 코드
//           lat += 0.0001
//           lng += 0.0001
//           const newLocation = { latitude: lat, longitude: lng }

//           dispatch(setLocation(newLocation))

//           const dist = haversineDistance(prevLocation, newLocation)
//           const averageStepLength = 0.8

//           if (dist >= 5 && dist < 20) {
//             dispatch(
//               updateDistanceAndSteps({
//                 distance: dist,
//                 steps: dist / averageStepLength,
//               })
//             )
//           }

//           return newLocation
//         }
//         return prevLocation
//       })
//     }, 5000)
//   }, [dispatch])

//   const stopMovement = useCallback(() => {
//     clearInterval(intervalRef.current)
//     intervalRef.current = null
//   }, [])

//   const initializeLocation = useCallback((location) => {
//     setCurrentLocation(location)
//   }, [])

//   useEffect(() => {
//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current)
//       }
//     }
//   }, [])

//   return {
//     startMovement,
//     stopMovement,
//     initializeLocation,
//   }
// }

// export default useMovement
