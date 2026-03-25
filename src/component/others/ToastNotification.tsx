import { CheckCircle, X, XCircle } from 'lucide-react';
import React, { useEffect } from 'react'

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const ToastNotification: React.FC<ToastProps> = ({message, type, onClose}) => {
    useEffect(()=> {
        const timer = setTimeout(()=>{
            onClose();
        }, 5000);
        return ()=> clearTimeout(timer);
    }, [onClose]);

    const isSuccess = type === 'success';

    const iconColor = isSuccess ? 'text-green-500' : 'text-red-500';
    const Icon = isSuccess ? CheckCircle : XCircle;
    const borderColor = isSuccess ? 'border-green-500' : 'border-red-500';


  return (
    <div className={`fixed top-5 right-5 z-[100] w-full max-w-sm animate-slide-in-right`}>
        <div className={`bg-white rounded-lg shadow-lg p-4 flex items-start border-l-4 ${borderColor}`}>
            <div className={`flex-shrink-0 ${iconColor}`}>
                <Icon size={24}/>

            </div>
            <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                    {isSuccess ? "Success" : 'Error'}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                    {message}
                </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
                <button onClick={onClose} className='inline-flex text-gray-400 hover:text-gray-500'><X size={20}/></button>
            </div>
        </div>
    </div>
  );
};

export default ToastNotification