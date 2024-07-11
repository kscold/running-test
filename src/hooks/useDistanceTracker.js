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

//   return R * c * 1000 // meters
// }

// export const useDistanceTracker = (initialLocation) => {
//   const [distance, setDistance] = useState(0)
//   const [steps, setSteps] = useState(0)
//   const [previousLocation, setPreviousLocation] = useState(initialLocation)

//   useEffect(() => {
//     if (initialLocation) {
//       setPreviousLocation(initialLocation)
//     }
//   }, [initialLocation])

//   const updateDistance = (newLocation) => {
//     if (previousLocation) {
//       const dist = haversineDistance(previousLocation, newLocation)

//       // 평균 성인 남성 걸음 길이 (약 0.8 미터) 이상 이동 시 걸음 수 증가
//       const stepLength = 0.8 // meters

//       if (dist >= stepLength) {
//         setDistance((prevDistance) => prevDistance + dist)
//         setSteps((prevSteps) => prevSteps + Math.floor(dist / stepLength))
//         setPreviousLocation(newLocation)
//       }
//     }
//   }

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       if (previousLocation) {
//         updateDistance(previousLocation)
//         console.log(`Distance: ${distance.toFixed(2)} meters, Steps: ${steps}`)
//       }
//     }, 5000) // 5초마다 거리 계산

//     return () => clearInterval(intervalId)
//   }, [previousLocation, distance, steps])

//   return { distance, steps, updateDistance }
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

  return R * c * 1000 // meters
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

      // 10미터 이상의 이동만 반영
      if (dist >= 10) {
        setDistance((prevDistance) => prevDistance + dist)
        setPreviousLocation(newLocation)
      }
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (previousLocation) {
        updateDistance(previousLocation)
        console.log(`Distance: ${distance.toFixed(2)} meters`)
      }
    }, 5000) // 5초마다 거리 계산

    return () => clearInterval(intervalId)
  }, [previousLocation, distance])

  return { distance, updateDistance }
}
