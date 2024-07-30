import React from 'react';
import flameIcon from '../assets/icons/flamme.png';

const Title = ({ text }) => {
        return (
            <div className="flex items-center ml-10 mb-2 mt-2">
                    <img src={flameIcon} alt="Flame Icon" className="h-10 w-10 mr-2 mb-4" />
                    <h2 className="text-2xl font-bold text-red-500" style={{ fontFamily: 'Bowlby One, sans-serif' }}>
                            {text}
                    </h2>
            </div>
        );
};

export default Title;