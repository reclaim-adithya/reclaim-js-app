'use client'
import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import Modal from './Modal';
import { ImSpinner8 } from "react-icons/im";
import { Inter } from 'next/font/google'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'
import { Reclaim } from '@reclaimprotocol/js-sdk';


const inter = Inter({ subsets: ['latin'] })
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || "0x68d546B72470E4D552e0D72ba279dbae56C0A672"
const APP_SECRET = process.env.NEXT_PUBLIC_APP_SECRET || "0x29f4dcc9d41f5888dccf09c9b0c330aee1dc53c5df929e61d738de0493bafdd6"

const providers = [
 {
   name: 'Uber',
   providerId: '55535317-71ad-4cac-9a38-22652e64be9e'
 }
];


const Hero = () => {
  console.log(`
    _    _                              _     _      _             _ 
   | |  | |                            | |   (_)    (_)           | |
   | |  | | ___      __ _ _ __ ___     | |__  _ _ __ _ _ __   __ _| |
   | |/\\| |/ _ \\    / _\` | '__/ _ \\    | '_ \\| | '__| | '_ \\ / _\` | |
   \\  /\\  /  __/   | (_| | | |  __/    | | | | | |  | | | | | (_| |_|
    \\/  \\/ \\___|    \\__,_|_|  \\___|    |_| |_|_|_|  |_|_| |_|\\__, (_)
                                                              __/ |  
                                                             |___/   
   
  If you are here, we're hiring hackers like you - integration engineering. 
  You will be looking at chrome devtools and building reclaim providers
   
  Apply -:
  https://x.com/madhavanmalolan/status/1792949714813419792
  `);


  const [url, setUrl] = useState('')
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false)

  const [showButton, setShowButton] = useState(true)

  const [myProviders, setMyProviders] = useState(providers)

  const [selectedProviderId, setSelectedProviderId] = useState('')

  const [proofs, setProofs] = useState()

  const { width, height } = useWindowSize()

  const urlRef = useRef(null);

  const reclaimClient = new Reclaim.ProofRequest(APP_ID);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      console.log('Link copied to clipboard');
    } catch(err) {
      console.error('Failed to copy link: ', err);
    }
  };

  const getVerificationReq = async (providerId) => {
    try {
      setIsLoaded(true)
      await reclaimClient.buildProofRequest(providerId)
      reclaimClient.setSignature(await reclaimClient.generateSignature(APP_SECRET))

      const { requestUrl, statusUrl } = await reclaimClient.createVerificationRequest()
      console.log('requestUrl', requestUrl)
      console.log('statusUrl', statusUrl)

      setUrl(requestUrl)
      setShowQR(true)
      setShowButton(false)
      setIsLoaded(false)

      await reclaimClient.startSession({
        onSuccessCallback: proofs => {
          console.log('Verification success', proofs)
          // Your business logic here
          setProofs(proofs[0])
          setShowQR(false)
        },
        onFailureCallback: error => {
          console.error('Verification failed', error)
          // Your business logic here to handle the error
          console.log('error', error)
        }
      })
    } catch(error) {
      console.error('Error in getVerificationReq', error)
      // Handle error gracefully, e.g., show a notification to the user
      // and possibly revert UI changes made before the error occurred
    }
  }

  console.log('proofs', proofs)
  const handleButtonClick = (providerId) => {
    setIsCopied(false)
    setProofs(null)
    getVerificationReq(providerId)
  }

  useEffect(() => {
    let details = navigator.userAgent;
    let regexp = /android|iphone|kindle|ipad/i;

    let isMobileDevice = regexp.test(details);

    if(isMobileDevice) {
      setIsMobileDevice(true)
    } else {
      setIsMobileDevice(false)
    }

  }, [])


  useEffect(() => {
    if(proofs) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000); // 10 seconds
    }
  }, [proofs]);
  return (
    <div className={`w-full ${inter.className}`}>

  
        <div className="relative">
          <div className="text-black text-center mt-4 w-5/6 mx-auto">
            <h1 className="text-[24px] md:text-[48px] font-[700]">
           
             Prove you have atleast 1 uber ride
            </h1>
            <p className="text-[16px] text-[#7E7E8F] font-[500] mb-4 text-center">
            </p>
          </div>

          <div className="w-full mx-auto">
          {isLoaded && (
      <div role="status" className='mt-10'>
        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
      </div>
    )}
    {showQR && (
      <>
        {!isMobileDevice && (
          <>
         <div className="mx-auto w-full md:w-1/5 mt-4 justify-center
              align-center
              mb-12 p-4 relative z-0 rounded-lg border-2 border-[#00E] bg-white shadow-[4px_4px_0px_0px_#00E]">

                  <QRCode
                    fgColor="#00E"
                    style={{
                      height: 'auto',
                      maxWidth: '100%',
                      width: '100%',
                    }}
                    value={url}
                  />
                  <p className="text-[16px] text-black font-[500] text-center mt-6">
                    Scan QR code with your phone camera
                  </p>
                </div>
          </>
        )}
        {isMobileDevice && (
          <>
            <button onClick={() => window.open(url, "_blank")} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Open Link</button>
          </>
        )}
        <span className='text-gray-300'>
          <button onClick={copyToClipboard} className="border-gray-500 border-2 mt-8 px-2 hover:bg-gray-300 text-gray-400 font-semibold rounded shadow">
            {isCopied ? 'Copied!' : 'Copy Link'}
          </button>
        </span>
      </>
    )}
          </div>
        </div>
      <Modal isOpen={proofs?.claimData} onDismiss={() => setIsModalOpen(false)} />
    </div>
  );
};




export default Hero;