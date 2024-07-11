import { useState } from "react"

export const useGeoLocation = (options = {}) => {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState("")

  const requestLocation = () => {
    const { geolocation } = navigator
    if (!geolocation) {
      setError("Geolocation이 지원되지 않습니다.")
      return
    }

    const handleSuccess = (pos) => {
      const { latitude, longitude } = pos.coords
      setLocation({ latitude, longitude })
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

    const watcher = geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    )

    return () => geolocation.clearWatch(watcher)
  }

  return { location, error, requestLocation }
}
