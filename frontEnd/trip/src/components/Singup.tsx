import { useState } from "react"
import logo from "../assets/logo.png"
import { validateEmail } from "../utils/validators"

type signupProp = {
    setSignupPopup: any
}

const SignUp = (props: signupProp) => {
    // State for form input
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [age, setAge] = useState("")
    const [preference1, setPreference1] = useState("")
    const [preference2, setPreference2] = useState("")
    const [preference3, setPreference3] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [contactNumber, setContactNumber] = useState("")

    // Handle sign-up submission
    const handleSignup = () => {
        // Example validation (you can enhance this later)
        if (!name || !email || !age || !password || !confirmPassword || !preference1 || !preference2 || !preference3) {
            console.error("All fields are required")
            return
        }

        if (password !== confirmPassword) {
            console.error("Passwords do not match")
            return
        }

        if (!validateEmail(email)) {
            console.error("Invalid email address")
            return
        }

        // You can call an API or other logic here to handle the sign-up process
        console.log("User signed up with:", name, email, age, preference1, preference2, preference3, password, contactNumber)

        // Close the popup after successful sign-up (for now, just logging it)
        props.setSignupPopup(false)
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
                                    <img src={logo} className="w-10 h-10 bg-green-400 rounded-full" />
                                    <h1 onClick={() => props?.setSignupPopup(false)} className="font-extrabold ml-96 cursor-pointer">X</h1>
                                </div>
                                <h1 className="font-semibold text-3xl mt-5">Create your account to get started with TripRecommender.</h1>

                                {/* Name */}
                                <div className="mt-3">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full p-3 rounded-full border mt-2"
                                    />
                                </div>

                                {/* Email */}
                                <div className="mt-3">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-3 rounded-full border mt-2"
                                    />
                                </div>

                                {/* Age */}
                                <div className="mt-3">
                                    <input
                                        type="number"
                                        placeholder="Age"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        className="w-full p-3 rounded-full border mt-2"
                                    />
                                </div>

                                {/* Preferences */}
                                <div className="mt-3">
                                    <input
                                        type="text"
                                        placeholder="Preference 1"
                                        value={preference1}
                                        onChange={(e) => setPreference1(e.target.value)}
                                        className="w-full p-3 rounded-full border mt-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Preference 2"
                                        value={preference2}
                                        onChange={(e) => setPreference2(e.target.value)}
                                        className="w-full p-3 rounded-full border mt-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Preference 3"
                                        value={preference3}
                                        onChange={(e) => setPreference3(e.target.value)}
                                        className="w-full p-3 rounded-full border mt-2"
                                    />
                                </div>

                                {/* Password */}
                                <div className="mt-3">
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full p-3 rounded-full border mt-2"
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div className="mt-3">
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full p-3 rounded-full border mt-2"
                                    />
                                </div>

                                {/* Contact Number (optional) */}
                                <div className="mt-3">
                                    <input
                                        type="text"
                                        placeholder="Contact Number"
                                        value={contactNumber}
                                        onChange={(e) => setContactNumber(e.target.value)}
                                        className="w-full p-3 rounded-full border mt-2"
                                    />
                                </div>

                                {/* Sign-Up Button */}
                                <button
                                    onClick={handleSignup}
                                    className="w-full mt-4 bg-black text-white rounded-full py-3"
                                >
                                    Sign Up
                                </button>

                                <h1 className="text-center mt-36">
                                    By proceeding, you agree to our Terms of Use and confirm you have read our Privacy and Cookie Statement.
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp
