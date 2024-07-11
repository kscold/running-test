// import { createSlice } from "@reduxjs/toolkit"

// const locationSlice = createSlice({
//   name: "location",
//   initialState: {
//     latitude: null,
//     longitude: null,
//     path: [],
//   },
//   reducers: {
//     setLocation: (state, action) => {
//       const { latitude, longitude } = action.payload
//       state.latitude = latitude
//       state.longitude = longitude
//       state.path.push({ latitude, longitude })
//     },
//   },
// })

// export const { setLocation } = locationSlice.actions
// export default locationSlice.reducer

import { createSlice } from "@reduxjs/toolkit"

const locationSlice = createSlice({
  name: "location",
  initialState: {
    latitude: null,
    longitude: null,
    path: [],
    distance: 0,
    steps: 0,
    tracking: false, // Tracking state added
  },
  reducers: {
    setLocation: (state, action) => {
      const { latitude, longitude } = action.payload
      state.latitude = latitude
      state.longitude = longitude
      if (state.tracking) {
        state.path.push({ latitude, longitude })
      }
    },
    resetLocation: (state) => {
      state.latitude = null
      state.longitude = null
      state.path = []
      state.distance = 0
      state.steps = 0
      state.tracking = false // Reset tracking state
    },
    updateDistanceAndSteps: (state, action) => {
      state.distance += action.payload.distance
      state.steps += action.payload.steps
    },
    setTrackingState: (state, action) => {
      state.tracking = action.payload
    },
  },
})

export const {
  setLocation,
  resetLocation,
  updateDistanceAndSteps,
  setTrackingState,
} = locationSlice.actions
export default locationSlice.reducer
