import { useGeoLocation } from "../hooks/useGeoLocation"
import { useCallback, useState } from "react"
import KakaoMap from "../components/KakaoMap"
import { useDispatch, useSelector } from "react-redux"
import { setTrackingState } from "../redux/location"
import { startMovement, stopMovement } from "../services/movementService"

const Step = () => {
  const [enableHighAccuracyState, setEnableHighAccuracyState] = useState(false)
  const { error, requestLocation, clearWatcher } = useGeoLocation({
    enableHighAccuracy: enableHighAccuracyState, // 정확성이 높지만 디바스의 배터리 소모가 빠름
    timeout: 1000 * 10, // api 최대 요청 시간 설정
    maximumAge: 1000 * 3600 * 24, // 불러온 값을 캐싱하는 시간
  })
  const location = useSelector((state) => state.location)
  const dispatch = useDispatch()

  const onClickStartTracking = useCallback(() => {
    requestLocation()
    dispatch(setTrackingState(true))
    startMovement(dispatch)
  }, [requestLocation, dispatch])

  const onClickStopTracking = () => {
    // setInterval 정리
    stopMovement()
    // 산책 상태 비활성 포함
    dispatch(setTrackingState(false))
    // 위치 추적을 중지
    clearWatcher()
  }

  const toggleHighAccuracy = () => {
    setEnableHighAccuracyState((prev) => !prev)
  }

  if (error) return <div>{error}</div>

  return (
    <div>
      {!location.tracking && (
        <button onClick={onClickStartTracking}>산책 시작</button>
      )}
      {location.tracking && (
        <button onClick={onClickStopTracking}>산책 종료</button>
      )}
      {location.latitude && location.longitude && (
        <>
          <KakaoMap
            location={location}
            path={location.path}
            distance={location.distance}
          />
          <div>거리: {location.distance.toFixed(2)} m</div>
          <div>약 걸음 수: {location.steps.toFixed(0)}</div>
          <button onClick={toggleHighAccuracy}>
            민감도 모드: {enableHighAccuracyState ? "켜짐" : "꺼짐"}
          </button>
        </>
      )}
    </div>
  )
}

export default Step
