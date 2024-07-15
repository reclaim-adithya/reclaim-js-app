'use client'
import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { useRouter } from 'next/router';
import { API } from '@/pages/_app';
import { supportedProviders } from '@/utils/supportedProviders';
import { useMediaQuery } from 'usehooks-ts';
import Modal from './Modal';
import { ImSpinner8 } from "react-icons/im";
import { Inter } from 'next/font/google'


const inter = Inter({ subsets: ['latin'] })



const Hero = () => {
  const router = useRouter();

  const [qrCode, setQRCode] = useState({
    requestUrl: '',
    statusUrl: '',
  });

  const [sessionId, setSessionId] = useState('');
  const [status, setStatus] = useState(Status.PENDING);
  const [invalidSession, setInvalidSession] = useState(false);
  const [type, setType] = useState('');
  const [username, setUsername] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const { type } = router.query
    const username = localStorage.getItem('username')
    if(!username) {
      // generate random username if not present
      const randomUsername = Math.random().toString(36).substring(7);
      setUsername(randomUsername)
      localStorage.setItem('username', randomUsername);
    }
    if(username) {
      setUsername(username)
    }
    if (!type) {
      setInvalidSession(true);
      return;
    }
    //
    if (!supportedProviders.includes(type)) {
      setInvalidSession(true);
      return;
    } else {
      setType(type);
    }
  }, [router.isReady, router.query]);
  


  const getQRCode = async () => {
    try {
      const res = await fetch(`${API}/quest/generate-proof?&username=${username}&type=${type}&campaignName=adithya`);
      const data = await res.json();
      setSessionId(data.statusUrl.split('/').pop());
      localStorage.setItem('sessionId', data.statusUrl.split('/').pop());
      setQRCode(data);
    } catch (err) {
      console.log(err);
    }
  };

  const checkStatus = async () => {
    try {
      const checkAlreadyCompleted = localStorage.getItem('isCompleted');
      const res = await fetch(`${API}/quest/status?sessionId=${sessionId}&username=${username}&type=${type}&campaignName=adithya`);
      const data = await res.json();
      if (data.status === 'pending') {
        setStatus(Status.PENDING);
      } else if (data.status === 'success') {
        setStatus(Status.COMPLETED);
        setIsModalOpen(true);
        
      } else {
        setStatus(Status.INVALID);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (!sessionId && type && !invalidSession && username) {
      getQRCode();
    }
  }, [qrCode, sessionId, type, invalidSession, router.isReady, username]);


  useEffect(() => {
    if (sessionId && type && !invalidSession && username) {
      const interval = setInterval(() => {
        checkStatus();
      }, 5000);
      checkStatus();
      return () => clearInterval(interval);
    }
  }, [qrCode, sessionId, type, invalidSession, router.isReady, username]);

  const isMobile = useMediaQuery('(max-width: 768px)');
  return (
    <div className={`w-full ${inter.className}`}>

      {invalidSession && (
        <div className="text-black text-center mt-4 w-3/5 mx-auto" suppressHydrationWarning={false}>
          <h1 className="text-[48px] font-[700] leading-[82.3px] mb-6">
            Invalid Session
          </h1>
          <p className="text-[18px] text-[#7E7E8F] font-[500]">
            The session you are trying to access is invalid. Please try again
          </p>
        </div>
      )}
      {!invalidSession && (
        <div className="relative">
          <div className="text-black text-center mt-4 w-5/6 mx-auto">
            <h1 className="text-[24px] md:text-[48px] font-[700]">
              {status === 'COMPLETED' ? 'Prove Your Uber Account' : `
              ${type === 'uber' ? 'Prove you have atleast 1 uber ride': 
              `Prove your ${type?.charAt(0)?.toLocaleUpperCase() + type?.slice(1,)} Supremacy!`}`}
            </h1>
            <p className="text-[16px] text-[#7E7E8F] font-[500] mb-4 text-center">
            </p>
          </div>

          <div className="w-full mx-auto">
            {qrCode.requestUrl && status !== 'COMPLETED' ? (
              isMobile ? (

                <a href={qrCode.requestUrl} target="_blank" className="align-center justify-center flex
                text-center mx-auto 
                w-1/2
  
                border-2 border-[#00E] bg-white shadow-[2px_2px_0px_0px_#00E]
                p-2 text-[#0000EE] rounded-[4px]">
                  Prove Now
                </a>) :


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
                    value={qrCode.requestUrl}
                  />
                  <p className="text-[16px] text-black font-[500] text-center mt-6">
                    Scan QR code with your phone camera
                  </p>
                  {status === Status.PENDING && (
                    <div className="flex justify-center w-full mt-2">
                      <div className="flex justify-center gap-2">
                        <ImSpinner8 className="animate-spin text-[#00E] text-2xl" />
                        <p className="text-[16px] text-black font-[500]">Waiting for proof submission</p>
                      </div>
                    </div>
                  )}
                </div>
            ) : '' }
           {
            status === 'COMPLETED' ? (
              <div className="flex justify-center mt-4">
                <h1 className='text-md
                text-[#7E7E8F] font-[500] text-center
                '>
                  You have successfully submitted the proof.
                </h1>
                </div>
            ) : (
              ''
            )
           }
            {!username ? (
              <div className="flex justify-center mt-4">
                <h1 className='text-md
                text-[#7E7E8F] font-[500] text-center
                '>
                 Fetching username...
                </h1>
                </div>
            ) : (
              ''
            )}
          </div>
        </div>
      )}
      <Modal isOpen={isModalOpen} onDismiss={() => setIsModalOpen(false)} />
    </div>
  );
};




export default Hero;