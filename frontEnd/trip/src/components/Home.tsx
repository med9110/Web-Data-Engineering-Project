import { Link } from "react-router-dom"

type tripProp = {
    trip:any,
    search:any
}

const Home = (props:tripProp) => {
  return (
    <div className="grid grid-cols-4">
        {props?.trip?.filter((data:any)=> data.name?.includes(props?.search)).map((data:any)=>{
            console.log(data)
            return <Link to="/details" state={{data:data}}><div className=" ml-7 mt-10">
                  <img src={data?.photo?.images?.original?.url} className="h-64 w-64 rounded-xl"/>
                  <h1 className="font-semibold">{data?.name}</h1>
                  <h1 className="font-semibold">{data?.category?.name}</h1>
                  <h1  className="font-semibold">Reviews : {data?.num_reviews}</h1>
                  <h1 className="font-semibold">Rating : {data?.rating}</h1>
            </div></Link>
        })}
    </div>
  )
}

export default Home
