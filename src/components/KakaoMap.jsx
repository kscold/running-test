// import React, { useEffect, useRef, useCallback } from "react"

// const KakaoMap = ({ location, path }) => {
//   const mapRef = useRef(null)
//   const polylineRef = useRef(null)
//   const markerRef = useRef(null)

//   useEffect(() => {
//     const script = document.createElement("script")
//     const apiKey = process.env.REACT_APP_KAKAO_MAP_API_KEY
//     script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services,clusterer,drawing`
//     script.async = true
//     script.onload = () => {
//       window.kakao.maps.load(() => {
//         const container = document.getElementById("map")
//         const options = {
//           center: new window.kakao.maps.LatLng(
//             location.latitude,
//             location.longitude
//           ),
//           level: 3,
//         }
//         const map = new window.kakao.maps.Map(container, options)
//         mapRef.current = map
//         map.setZoomable(false) // 확대/축소 막기

//         const marker = new window.kakao.maps.Marker({
//           position: new window.kakao.maps.LatLng(
//             location.latitude,
//             location.longitude
//           ),
//         })
//         marker.setMap(map)
//         markerRef.current = marker

//         const linePath = path.map(
//           (loc) => new window.kakao.maps.LatLng(loc.latitude, loc.longitude)
//         )

//         const polyline = new window.kakao.maps.Polyline({
//           path: linePath,
//           strokeWeight: 3,
//           strokeColor: "#FFAE00",
//           strokeOpacity: 1,
//           strokeStyle: "solid",
//         })

//         polyline.setMap(map)
//         polylineRef.current = polyline
//       })
//     }
//     document.head.appendChild(script)
//   }, [])

//   useEffect(() => {
//     if (mapRef.current && polylineRef.current && markerRef.current) {
//       const newLinePath = path.map(
//         (loc) => new window.kakao.maps.LatLng(loc.latitude, loc.longitude)
//       )
//       polylineRef.current.setPath(newLinePath)

//       const lastLocation = path[path.length - 1]
//       const markerPosition = new window.kakao.maps.LatLng(
//         lastLocation.latitude,
//         lastLocation.longitude
//       )
//       markerRef.current.setPosition(markerPosition)

//       mapRef.current.setCenter(markerPosition)
//     }
//   }, [path])

//   return <div id="map" style={{ width: "100%", height: "500px" }}></div>
// }

// export default KakaoMap

import React, { useEffect, useRef } from "react"

const KakaoMap = ({ location, path, distance }) => {
  const mapRef = useRef(null)
  const polylineRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    const script = document.createElement("script")
    const apiKey = process.env.REACT_APP_KAKAO_MAP_API_KEY
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services,clusterer,drawing`
    script.async = true
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map")
        const options = {
          center: new window.kakao.maps.LatLng(
            location.latitude,
            location.longitude
          ),
          level: 3,
        }
        const map = new window.kakao.maps.Map(container, options)
        mapRef.current = map
        map.setZoomable(false)

        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(
            location.latitude,
            location.longitude
          ),
        })
        marker.setMap(map)
        markerRef.current = marker

        const linePath = path.map(
          (loc) => new window.kakao.maps.LatLng(loc.latitude, loc.longitude)
        )

        const polyline = new window.kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 3,
          strokeColor: "#FFAE00",
          strokeOpacity: 1,
          strokeStyle: "solid",
        })

        polyline.setMap(map)
        polylineRef.current = polyline
      })
    }
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (mapRef.current && polylineRef.current && markerRef.current) {
      const newLinePath = path.map(
        (loc) => new window.kakao.maps.LatLng(loc.latitude, loc.longitude)
      )
      polylineRef.current.setPath(newLinePath)

      const lastLocation = path[path.length - 1]
      const markerPosition = new window.kakao.maps.LatLng(
        lastLocation.latitude,
        lastLocation.longitude
      )
      markerRef.current.setPosition(markerPosition)

      mapRef.current.setCenter(markerPosition)
    }
  }, [path])

  return <div id="map" style={{ width: "100%", height: "500px" }}></div>
}

export default KakaoMap
