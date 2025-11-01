'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import Image from 'next/image';
import useDashboard from '../../../hooks/useDashboard';

export default function SubscriptionCard() {

    const { subScriptionButton } = useDashboard();
    const toast = useRef(null);
    const [timer, setTimer] = useState(5);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 1 ? prev - 1 : 1));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const accept = () => {
        toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    };

    const confirm = () => {
        confirmDialog({
            position: subScriptionButton,
            accept,
            reject,
            message: (
                <div className="bg-white rounded-2xl w-[350px] text-center">
                    <div className="w-[60px] h-[60px] m-auto">
                        <Image width={200} height={200} className='w-full h-full' src='/images/subscriptionLogo.png' alt='subscription Logo' />
                    </div>
                    <h2 className="text-xl font-semibold text-purple-600 mt-4">StoryStream Pro</h2>
                    <p className="text-lg font-bold text-gray-900 my-3">
                        Unlock All Shows & Books<br />with StoryStream Pro
                    </p>
                    <div className='border border-gray-200'></div>
                    <p className="text-gray-600 mt-3">Subscribe now to enjoy Unlimited Access</p>

                    <button className="bg-gradient-to-r mt-4 from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl text-lg font-medium w-full transition hover:opacity-90">
                        Subscribe Now ({timer} Sec)
                    </button>

                    <div className="text-sm text-gray-600 mt-2 cursor-pointer hover:underline" onClick={reject}>
                        &larr; I’ll try this later, take me back
                    </div>
                    <div className="text-xs text-white bg-black px-3 py-1 rounded-full inline-block mt-2">
                        11 / 46
                    </div>
                </div>
            ),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center space-y-6">
                <Toast ref={toast} />
                <ConfirmDialog />
                {/* <div className="flex justify-center mt-2">
                    <PrimeButton
                        label="Subscription Modal"
                        onClick={() => confirm('bottom')}
                        className="p-button-danger"
                        style={{ minWidth: '10rem' }}
                    />
                </div> */}
            </div>
        </div>
    );
}
