import { useLocation } from "react-router-dom"
import Navbar from "./Navbar"

const Details = () => {

    const location = useLocation()

    console.log(location)

  return (
    <div>
      <Navbar/>
      <div className="p-6">
      <h1 className="font-extrabold text-3xl">{location?.state?.data?.name}</h1>
      <h1>{location?.state?.data?.num_reviews} reviews</h1>
      <img src={location?.state?.data?.photo?.images?.large?.url} className="rounded-xl mt-5"/>
      <h1 className="mt-3 font-semibold">About</h1>
      <h1 className="mt-3">{location?.state?.data?.description}</h1>
      <h1 className="mt-5 font-semibold">Address : {location?.state?.data?.address}</h1>
      </div>
    </div>
  )
}

export default Details
