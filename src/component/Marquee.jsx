import Marquee from "react-fast-marquee";
import { FaHeart } from "react-icons/fa";


import React from 'react'


const MarqueeBox = ({ }) => {

    return (
        <Marquee
            autoFill={true}
            delay={0}
            loop={0}
            className="flex  bg-[#FAF4F0] border-t-2 border-[#00E]
                bg-white p-4">
            <div className="flex items-center gap-2 text-[24px] font-[700] mr-4">
                <FaHeart className="text-[#00E] text-2xl" />
                Reclaim x Adithya Quest 
            </div>
        </Marquee>
    );
}

export default MarqueeBox