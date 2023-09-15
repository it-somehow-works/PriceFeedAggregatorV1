from web3 import Web3
import requests
from cache import Cache

def fetch_ethereum_price_chainlink_nodes():
    # Connect to an Ethereum node. You can use services like Infura, or use a local Ethereum node.
    w3 = Web3(Web3.HTTPProvider("https://mainnet.infura.io/v3/0f49b992c03f4e88aaf5f2891068891a"))

    # Chainlink ETH/USD price feed address
    price_feed_address = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'  # Update this if the address changes

    # ABI for the price feed contract
    abi = [{"inputs": [],"name": "latestRoundData","outputs": [{"internalType": "uint80","name": "roundId","type": "uint80"},{"internalType": "int256","name": "answer","type": "int256"},{"internalType": "uint256","name": "startedAt","type": "uint256"},{"internalType": "uint256","name": "updatedAt","type": "uint256"},{"internalType": "uint80","name": "answeredInRound","type": "uint80"}],"stateMutability": "view","type": "function"}]
    
    # Create a contract object
    contract = w3.eth.contract(address=price_feed_address, abi=abi)

    # Fetch the latest round data
    latest_round_data = contract.functions.latestRoundData().call()

    # The 'answer' field in the data is the price, but it's not in a human-friendly format
    raw_price = latest_round_data[1]

    # Convert the raw price to a human-friendly format
    price = raw_price / 10**8  # Change the exponent according to the contract's decimal configuration

    return price


def fetch_binance_eth_price():
    url = "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        return float(data['price'])
    else:
        return None

cache = Cache()

def start_updates():
    eth_price_chainlink_nodes = fetch_ethereum_price_chainlink_nodes()
    eth_price_binance = fetch_binance_eth_price()
    print(f"Updated: {eth_price_chainlink_nodes}, {eth_price_binance}")
    cache.set('ETH_Price_Chainlink_Nodes', f'{eth_price_chainlink_nodes}')
    cache.set('ETH_Price_Binance', f'{eth_price_binance}')
    print(cache.data)