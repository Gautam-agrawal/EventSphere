import Header from "../components/Header"
import Navbar from "../components/NavBar"
import OTPVerification from "../components/OtpPage"

export default function OtpPage(){
    return(
        <>
        <Navbar/>
            <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full space-y-8" style={{"maxWidth": "30rem"}}>
                    <Header
                        heading="Verify your account"
                        paragraph="Check your registered email account"
                        />
                    <OTPVerification/>
                </div>
            </div>
        </>
    )
}