
import logo from "../assets/logo.png"
import email from "../assets/email.png"
import google from "../assets/google.png"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../firebase/setup"

type signinProp = {
    setSigninPopup:any
}

const Signin = (props:signinProp) => {
    

    const googleSignin = async() =>{
        try{
            await signInWithPopup(auth,googleProvider)
        }catch(err){
            console.error(err)
        }
    }

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div className="fixed inset-0 bg-zinc-500 bg-opacity-75 transition-opacity"></div>

  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:items-start p-4">
            <div className="flex">
            <img src={logo} className="w-10 h-10 bg-green-400 rounded-full"/>
            <h1 onClick={()=>props?.setSigninPopup(false)} className="font-extrabold ml-96 cursor-pointer">X</h1>
            </div>
            <h1 className="font-semibold text-3xl mt-5">Sign in to unlock the<br/> best of Tripadvisor.</h1>
            <div onClick={googleSignin} className=" cursor-pointer rounded-full border border-spacing-1 border-black flex p-3 mt-14">
                <img src={google} className="w-5 h-5"/>
                <h1 className="ml-28">Continue with google</h1>
            </div>
            <div className="rounded-full border border-spacing-1  border-black flex p-3 mt-3">
                <img src={email} className="w-5 h-5"/>
                <h1 className="ml-28">Continue with email</h1>
            </div>
            <h1 className="text-center mt-36">By proceeding, you agree to our Terms of Use and confirm you have read our Privacy and Cookie Statement.</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  )
}

export default Signin
