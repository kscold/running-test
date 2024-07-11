// import { useState, useEffect } from "react"

// export const useGeoLocation = (options = {}) => {
//   const [location, setLocation] = useState(null)
//   const [error, setError] = useState("")

//   const handleSuccess = (pos) => {
//     const { latitude, longitude } = pos.coords
//     setLocation({ latitude, longitude })
//   }

//   const handleError = (err) => {
//     if (err.code === err.PERMISSION_DENIED) {
//       setError(
//         "Location access denied by user. Please enable location services and refresh the page."
//       )
//     } else {
//       setError(err.message)
//     }
//   }

//   useEffect(() => {
//     const { geolocation } = navigator
//     if (!geolocation) {
//       setError("Geolocation is not supported.")
//       return
//     }

//     const watcher = geolocation.watchPosition(
//       handleSuccess,
//       handleError,
//       options
//     )

//     return () => geolocation.clearWatch(watcher)
//   }, [options])

//   return { location, error }
// }

import { useState, useEffect } from "react"

export const useGeoLocation = (options = {}) => {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState("")

  const requestLocation = () => {
    const { geolocation } = navigator
    if (!geolocation) {
      setError("Geolocation is not supported.")
      return
    }

    const handleSuccess = (pos) => {
      const { latitude, longitude } = pos.coords
      setLocation({ latitude, longitude })
    }

    const handleError = (err) => {
      if (err.code === err.PERMISSION_DENIED) {
        setError(
          "Location access denied by user. Please enable location services and refresh the page."
        )
      } else {
        setError(err.message)
      }
    }

    const watcher = geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    )

    return () => geolocation.clearWatch(watcher)
  }

  return { location, error, requestLocation }
}
