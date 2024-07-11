// // hooks/useDistanceTracker.js
// import { useState, useEffect } from "react"

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

//   return R * c
// }

// export const useDistanceTracker = (initialLocation) => {
//   const [distance, setDistance] = useState(0)
//   const [previousLocation, setPreviousLocation] = useState(initialLocation)

//   useEffect(() => {
//     if (initialLocation) {
//       setPreviousLocation(initialLocation)
//     }
//   }, [initialLocation])

//   const updateDistance = (newLocation) => {
//     if (previousLocation) {
//       const dist = haversineDistance(previousLocation, newLocation)
//       setDistance((prevDistance) => prevDistance + dist)
//       setPreviousLocation(newLocation)
//     }
//   }

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       if (previousLocation) {
//         updateDistance(previousLocation)
//         console.log(`Distance: ${distance.toFixed(2)} km`)
//       }
//     }, 5000) // 5초마다 거리 계산

//     return () => clearInterval(intervalId)
//   }, [previousLocation, distance])

//   return { distance, updateDistance }
// }

// hooks/useDistanceTracker.js
// import { useState, useEffect } from "react"

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

//   return R * c
// }

// export const useDistanceTracker = (initialLocation) => {
//   const [distance, setDistance] = useState(0)
//   const [previousLocation, setPreviousLocation] = useState(initialLocation)

//   useEffect(() => {
//     if (initialLocation) {
//       setPreviousLocation(initialLocation)
//     }
//   }, [initialLocation])

//   const updateDistance = (newLocation) => {
//     if (previousLocation) {
//       const dist = haversineDistance(previousLocation, newLocation)

//       // 필터링 조건: 비정상적으로 큰 이동 거리 무시 (예: 100미터 초과)
//       if (dist < 0.1) {
//         setDistance((prevDistance) => prevDistance + dist)
//         setPreviousLocation(newLocation)
//       }
//     }
//   }

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       if (previousLocation) {
//         updateDistance(previousLocation)
//         console.log(`Distance: ${distance.toFixed(2)} km`)
//       }
//     }, 5000) // 5초마다 거리 계산

//     return () => clearInterval(intervalId)
//   }, [previousLocation, distance])

//   return { distance, updateDistance }
// }

// hooks/useDistanceTracker.js
import { useState, useEffect } from "react"

const haversineDistance = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180

  const R = 6371 // km
  const dLat = toRad(coords2.latitude - coords1.latitude)
  const dLon = toRad(coords2.longitude - coords1.longitude)
  const lat1 = toRad(coords1.latitude)
  const lat2 = toRad(coords2.latitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

export const useDistanceTracker = (initialLocation) => {
  const [distance, setDistance] = useState(0)
  const [previousLocation, setPreviousLocation] = useState(initialLocation)

  useEffect(() => {
    if (initialLocation) {
      setPreviousLocation(initialLocation)
    }
  }, [initialLocation])

  const updateDistance = (newLocation) => {
    if (previousLocation) {
      const dist = haversineDistance(previousLocation, newLocation)

      // 50m 이상의 이동만 반영
      if (dist >= 0.05) {
        setDistance((prevDistance) => prevDistance + dist)
        setPreviousLocation(newLocation)
      }
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (previousLocation) {
        updateDistance(previousLocation)
        console.log(`Distance: ${distance.toFixed(2)} km`)
      }
    }, 5000) // 5초마다 거리 계산

    return () => clearInterval(intervalId)
  }, [previousLocation, distance])

  return { distance, updateDistance }
}
