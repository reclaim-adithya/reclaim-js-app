'use client'
import ReclaimLogo from '@/assets/logo'
import React, { useState, useEffect } from 'react'
import ReclaimMobileLogo from '@/assets/reclaimMobile';




const NavBar = ({}) => {
        const [isMobile, setIsMobileDevice] = useState(false)

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

        return (
            <>
                <nav 

                    className="flex w-full justify-between items-center md:gap-6 bg-[#FAF4F0] border-b-2 border-[#00E]"
                >
                        <div className="flex
                        md:py-2 md:px-4
                        border-r-2 border-[#00E]
                        
                        ">
                            {isMobile ? <ReclaimMobileLogo 
                            className='w-14'
                            /> :
                            <ReclaimLogo className='w-24 md:w-52' />}
                        </div>
                   
                     
                    </nav>
            </>
        );
}

export default NavBar