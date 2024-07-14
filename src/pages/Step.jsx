import { useGeoLocation } from "../hooks/useGeoLocation"
import { useDistanceTracker } from "../hooks/useDistanceTracker"
import { useEffect, useRef, useCallback } from "react"
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
  const { updateDistance, refreshDistance } = useDistanceTracker()
  const dispatch = useDispatch()
  const intervalRef = useRef(null)
  const firstLocationRef = useRef(null) // 처음 위치를 저장할 Ref

  const onClickStartTracking = useCallback(() => {
    requestLocation()
    dispatch(setTrackingState(true))
  }, [requestLocation, dispatch])

  const onClickStopTracking = () => {
    // setInterval 정리
    clearInterval(intervalRef.current)
    // watchPosition 정리
    clearWatcher()
    // 현재 위치 초기화(산책 상태 비활성 포함)
    dispatch(resetLocation())
    dispatch(setTrackingState(false))
  }

  useEffect(() => {
    if (location.tracking) {
      firstLocationRef.current = {
        latitude: location.latitude,
        longitude: location.longitude,
      }
      refreshDistance(location)

      intervalRef.current = setInterval(() => {
        let lat = location.latitude
        let lng = location.longitude

        // 테스트 이동 코드
        // lat += 0.0001
        // lng += 0.0001
        const newLocation = { latitude: lat, longitude: lng }

        // 새로운 위치의 위경도와 현재 위경도가 같이 않을 때에만 업데이트
        if (
          newLocation.latitude !== firstLocationRef.current.latitude ||
          newLocation.longitude !== firstLocationRef.current.longitude
        ) {
          dispatch(setLocation(newLocation))
          updateDistance(newLocation)
        }
      }, 5000)

      // 이 뒷정리 코드가 없으면 좌표가 튐
      return () => clearInterval(intervalRef.current)
    }
  }, [
    location.tracking, // 산책 상태 유뮤가 바뀔 때
    location.latitude, // 위도가 업데이트 될 때
    location.longitude, // 경도가 업데이트 될 때
    updateDistance, // 위치 업데이트 메서드가 실행 될 떄
    refreshDistance, // 위치로 새로고침 메서드가 실행 될 때
    dispatch, // 리듀서함수에 액션이 전달될 때
  ])

  if (error) return <div>{error}</div>

  return (
    <div>
      {!location.tracking && (
        <button onClick={onClickStartTracking}>산책 시작</button>
      )}
      {location.tracking && (
        <button onClick={onClickStopTracking}>산책 종료</button>
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
