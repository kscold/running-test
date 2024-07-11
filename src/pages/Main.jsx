import React from "react"

import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const Main = () => {
  const navigate = useNavigate()
  const location = useSelector((state) => state.location)

  return (
    <>
      <button onClick={() => navigate("/step")}>지도로 이동</button>
      <div>리덕스 백그라운드 뷰 위치: {JSON.stringify(location)}</div>
    </>
  )
}

export default Main
