import React from 'react';
import ReactLoading from 'react-loading';

const LoadingModal = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            <div className="flex flex-col items-center">
                <ReactLoading type={'spin'} color={"#0027d5"} height={100} width={100} />
                <p className="mt-4 text-lg text-gray-800">Cargando, por favor espera...</p>
            </div>
        </div>
    );
};

export default LoadingModal;
