import React from 'react';
import Link from 'next/link';

type NavbarProps = {
    isConnected: boolean;
    userAddress: string | null;
    connectToMetaMask: () => void;
    disconnectFromMetaMask: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ isConnected, userAddress, connectToMetaMask, disconnectFromMetaMask }) => {
    return (
        <nav className="flex justify-between items-center p-4 bg-gray-800">
            <Link href="/" className="logo">Price Feed Aggregator</Link>
            {isConnected ? (
                <div className="flex items-center">
                    <span className="text-white mr-2">{userAddress}</span>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={disconnectFromMetaMask}
                    >
                        Disconnect
                    </button>
                </div>
            ) : (
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={connectToMetaMask}
                >
                    Connect to MetaMask
                </button>
            )}
        </nav>
    );
};

export default Navbar;