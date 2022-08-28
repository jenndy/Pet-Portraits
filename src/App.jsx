import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [	'https://i.etsystatic.com/7051074/c/800/635/0/57/il/9ad31a/1701826445/il_680x540.1701826445_sydr.jpg',
'https://i.etsystatic.com/7051074/r/il/7abf4c/1701819177/il_1588xN.1701819177_mvx3.jpg',
'https://i.etsystatic.com/7051074/r/il/fd8929/1701827101/il_1588xN.1701827101_hely.jpg',
'https://i.etsystatic.com/7051074/c/960/762/0/44/il/db01e4/1654341264/il_680x540.1654341264_fnav.jpg'
];

const App = () => {
	// State
	const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

	/* Logic for if Phantom wallet is connected or not */
	const checkIfWalletIsConnected = async () => {
		try {
			const { solana } = window;

			if (solana) {
				if (solana.isPhantom) {
					console.log('Phantom wallet found!');
					/* The solana object gives us a function that will allow us to connect directly with the user's wallet */
					const response = await solana.connect({ onlyIfTrusted: true });
					console.log(
						'Connected with Public Key:',
						response.publicKey.toString()
					);

					/*
           * Set the user's publicKey in state to be used later!
           */
					setWalletAddress(response.publicKey.toString());
				}
			} else {
				alert('Solana object not found! Get a Phantom Wallet 👻');
			}
		} catch (error) {
			console.error(error);
		}
	};

	const connectWallet = async () => {
		const { solana } = window;

		if (solana) {
			const resonse = await solana.connect();
			console.log('Connected with Public Key:', response.publicKey.toString());
			setWalletAddress(response.publicKey.toString());
		}
	};

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue('');
    } else {
      console.log('Empty input. Try again.');
    }
  };
  
  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };
  
	/* Render UI when user hasn't connected their wallet to app yet */
	const renderNotConnectedContainer = () => (
		<button
			className="cta-button connect-wallet-button"
			onClick={connectWallet}
		>
			Connect to Wallet
		</button>
	);

	/* Renders image links */
	const renderConnectedContainer = () => (
		<div className="connected=container">
      
      {/* Input button */}
      <form 
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        
        <input 
          type="text" 
          placeholder="(enter pic link here)" 
          value={inputValue}
          onChange={onInputChange}
        />
    
        <button type="submit" className="cta-button submit-gif-button">Submit</button>
      </form>
      
			<div className="gif-grid">
        {/* Map through gifList instead of TEST_GIFS */}
				{gifList.map((gif) => (
					<div className="gif-item" key={gif}>
						<img src={gif} alt={gif} />
					</div>
				))}
			</div>
		</div>
	);

	/* When component first mounts, check to see if have a connected Phantom wallet*/

	useEffect(() => {
		const onLoad = async () => {
			await checkIfWalletIsConnected();
		};
		window.addEventListener('load', onLoad);
		return () => window.removeEventListener('load', onLoad);
	}, []);

  useEffect(() => {
    if (walletAddress){
      console.log('Fetching GIF list...');
      
      // Call Solana program here.
      
      // Set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

	return (
		<div className="App">
			{/* styling fanciness */}
			<div className={walletAddress ? 'authed-container' : 'container'}>
				<div className="header-container">
					<p className="header">🖼 Guinea Pig Portal</p>
					<p className="sub-text">
						View your guinea pig collection in the metaverse ✨
					</p>
					{/* Shows this if don't have a wallet address */}
					{!walletAddress && renderNotConnectedContainer()}
          {/* Show this if we have a wallet address */}
          {walletAddress && renderConnectedContainer()}
				</div>
				<div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`built on @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
};

export default App;
