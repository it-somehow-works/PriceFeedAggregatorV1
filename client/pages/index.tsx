import React, { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';

type CryptoData = {
    name: string;
    price: string;
};

const HomePage: React.FC = () => {
    const [cryptoData, setCryptoData] = useState<CryptoData[]>([
        { name: 'Chainlink Oracles', price: 'Fetching...' },
        { name: 'Binance', price: 'Fetching...' },
    ]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ETH_Price_Chainlink_NodesRes, ETH_Price_BinanceRes] = await Promise.all([
                    fetch('http://127.0.0.1:8080/api/ethereum_cpf/price'),
                    fetch('http://127.0.0.1:8080/api/ethereum_binance/price'),
                ]);

                const ethPriceChainlinkNodesData = await ETH_Price_Chainlink_NodesRes.json();
                const ethPriceBinanceData = await ETH_Price_BinanceRes.json();

                const chainlinkPrice = ethPriceChainlinkNodesData.ETH_Price_Chainlink_Nodes;
                const binancePrice = ethPriceBinanceData.ETH_Price_Binance;

                setCryptoData([
                    { name: 'Infura via Chainlink', price: chainlinkPrice },
                    { name: 'Binance', price: binancePrice },
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 1000);

        return () => clearInterval(interval);
    }, []);

    const connectToMetaMask = async () => {
        try {
            // Request MetaMask connection
            // @ts-ignore
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            // MetaMask is connected, you can now interact with Ethereum
            setIsConnected(true);

            console.log('Connected to MetaMask');
        } catch (error) {
            console.error('MetaMask connection error:', error);
        }
    };

    return (
        <div className="container mx-auto my-10 bg-blue-500 min-h-screen">
            <div className="container mx-auto my-10">
                <center>
                    <h1 className="text-3xl font-semibold mb-5">Price Feed Aggregator</h1>
                    {!isConnected ? (
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={connectToMetaMask}
                        >
                            Connect to MetaMask
                        </button>
                    ) : (
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">Ethereum</th>
                                    <th className="py-2 px-4 border">Price (USD)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cryptoData.map((crypto, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="py-2 px-4 border">{crypto.name}</td>
                                        <td className="py-2 px-4 border">{crypto.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </center>
            </div>
        </div>
    );
};

export default HomePage;