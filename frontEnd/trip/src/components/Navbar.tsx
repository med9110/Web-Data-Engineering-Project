import { useState } from "react"
import logo from "../assets/logo.png"
import Signin from "./Signin"


const Navbar = () => {


  const [signinPopup,setSigninPopup] = useState(false)

  return (
    <>
     <div className="flex pt-4 pl-20">
      <img src={logo} className="w-10 h-10 bg-green-400 rounded-full"/>
      <h1 className="font-bold text-2xl">Tripadvisor</h1>
      <h1 className="font-semibold mt-2 ml-60">Discover</h1>
      <h1 className="font-semibold mt-2 ml-11">Trips</h1>
      <h1 className="font-semibold mt-2 ml-11">Review</h1>
      <h1 className="font-semibold mt-2 ml-11">More</h1>
      <button onClick={()=> setSigninPopup(true)} className="rounded-full bg-black p-3 text-white w-20 ml-80">Sign in</button>
    </div>
    <h1 className="font-extrabold text-center text-5xl mt-10">Where to?</h1>
    {signinPopup && <Signin setSigninPopup={setSigninPopup}/>}
    </>
   
  )
}

export default Navbar
