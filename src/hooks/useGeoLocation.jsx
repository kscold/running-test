// import { useState, useEffect } from "react"

// export const useGeoLocation = (options = {}) => {
//   const [location, setLocation] = useState(null)
//   const [error, setError] = useState("")

//   const requestLocation = () => {
//     const { geolocation } = navigator
//     if (!geolocation) {
//       setError("Geolocation이 지원되지 않습니다.")
//       return
//     }

//     const handleSuccess = (pos) => {
//       const { latitude, longitude } = pos.coords
//       setLocation({ latitude, longitude })
//     }

//     const handleError = (err) => {
//       if (err.code === err.PERMISSION_DENIED) {
//         setError(
//           "사용자가 위치 액세스를 거부했습니다. 위치 서비스를 활성화하고 페이지를 새로고침하세요."
//         )
//       } else {
//         setError(err.message)
//       }
//     }

//     const watcher = geolocation.watchPosition(
//       handleSuccess,
//       handleError,
//       options
//     )
//     return () => geolocation.clearWatch(watcher)
//   }

// useEffect(() => {
//   const simulateMovement = () => {
//     if (!location) return // location이 null이 아니어야 함

//     let lat = location.latitude // Starting 위도
//     let lng = location.longitude // Starting 경도

//     const intervalId = setInterval(() => {
//       lat += 0.0001
//       lng += 0.0001
//       setLocation({ latitude: lat, longitude: lng })
//     }, 5000) // 5초마다 업데이트
//   }

//   simulateMovement()
// }, [location])

//   return { location, error, requestLocation }
// }

import { useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { setLocation } from "../redux/location"

export const useGeoLocation = (options = {}) => {
  const [error, setError] = useState("")
  const dispatch = useDispatch()
  const watcherRef = useRef(null)

  const requestLocation = () => {
    const { geolocation } = navigator
    if (!geolocation) {
      setError("Geolocation이 지원되지 않습니다.")
      return
    }

    const handleSuccess = (pos) => {
      const { latitude, longitude } = pos.coords
      dispatch(setLocation({ latitude, longitude }))
    }

    const handleError = (err) => {
      if (err.code === err.PERMISSION_DENIED) {
        setError(
          "사용자가 위치 액세스를 거부했습니다. 위치 서비스를 활성화하고 페이지를 새로고침하세요."
        )
      } else {
        setError(err.message)
      }
    }

    watcherRef.current = geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    )
  }

  const clearWatcher = () => {
    if (watcherRef.current !== null) {
      navigator.geolocation.clearWatch(watcherRef.current)
    }
  }

  return { error, requestLocation, clearWatcher }
}
