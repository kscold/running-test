import { lazy, Suspense } from "react"
import { createBrowserRouter } from "react-router-dom"

import Main from "./pages/Main"
const Step = lazy(() => import("./pages/Step"))

const Loading = () => <div>로딩중...</div>

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "step",
    element: (
      <Suspense fallback={<Loading />}>
        <Step />
      </Suspense>
    ),
  },
])

export default router
