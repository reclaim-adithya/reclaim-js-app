import Image from 'next/image';
import React from 'react'



const Modal = ({ isOpen, onDismiss }) => {
    if(!isOpen) return null
        return (
            <>
        <div className="fixed inset-0 bg-black backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-99999
        ">
      <div className="mx-auto 
      rounded-lg border-2 border-[#00E] bg-white shadow-[4px_4px_0px_0px_#00E] flex w-[523px] p-8 flex-col justify-center items-center gap-6">
            <Image
                src='https://media1.tenor.com/m/K88FeHa0bFEAAAAC/rugby-yay.gif'
                width={500}
                height={200}
                alt='Success Image'
            />
            <h1 className="text-xl font-bold text-black w-full text-center">
        Successfully proof submitted!
            </h1>
     
      </div>
    </div>

    </>
        );
}

export default Modal