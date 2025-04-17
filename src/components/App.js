import React, { Component } from 'react';
import './App.css';
import Navbar from './Navbar.js';
import "../logo.png";
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json';
import RWD from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';
import Main from './Main.js';

// Modern SVG icons as components
const MoonIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ color: '#f0abfc' }}
    >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 A7 7 0 0 0 21 12.79z"></path>
    </svg>
);

const SunIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ color: '#9333ea' }}
    >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '0x0',
            tether: {},
            rwd: {},
            decentralBank: {},
            tetherBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true,
            darkMode: true,
            hasMetaMask: false
        };
    }

    async UNSAFE_componentWillMount() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            this.setState({ darkMode: false });
            document.documentElement.classList.remove('dark');
        } else {
            // Default to dark mode
            document.documentElement.classList.add('dark');
        }
        
        // Check if MetaMask is installed
        if (window.ethereum || window.web3) {
            this.setState({ hasMetaMask: true });
            await this.loadWeb3();
            await this.loadBlockchainData();
        } else {
            this.setState({ 
                loading: false,
                hasMetaMask: false 
            });
        }
    }

    toggleTheme = () => {
        this.setState(prevState => {
            const newDarkMode = !prevState.darkMode;
            localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
            
            if (newDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            
            return { darkMode: newDarkMode };
        });
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            try {
             await window.ethereum.request({ method: 'eth_requestAccounts' });
            } catch (error) {
              if (error.code === 4001) {
               alert('You need to connect MetaMask to use VaultVerse!');
              } else {
                console.error('MetaMask connection error:', error);
              }
            }

        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3;
        const account = await web3.eth.getAccounts();
        this.setState({ account: account[0] });
        const networkId = await web3.eth.net.getId();

        // Load Tether contract
        const tetherData = Tether.networks[networkId];
        if (tetherData) {
            const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
            const accounts = await web3.eth.getAccounts();
            console.log('Current account:', this.state.account);
            const deployerBalance = await tether.methods.balanceOf(accounts[0]).call();
            console.log('Deployer balance:', deployerBalance.toString());
            this.setState({ tether });
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call();
            this.setState({ tetherBalance: tetherBalance.toString() });
            console.log({ balance: tetherBalance });
        } else {
            window.alert('Error! Tether contract not deployed - No detected network');
        }

        // Load RWD Contract
        const rwdData = RWD.networks[networkId];
        if (rwdData) {
            const rwd = new web3.eth.Contract(RWD.abi, rwdData.address);
            this.setState({ rwd });
            let rwdBalance = await rwd.methods.balanceOf(this.state.account).call();
            this.setState({ rwdBalance: rwdBalance.toString() });
        } else {
            window.alert('Rwd token not deployed to the network');
        }

        // Load DecentralBank Contract
        const decentralBankData = DecentralBank.networks[networkId];
        if (decentralBankData) {
            const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address);
            this.setState({ decentralBank });
            let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call();
            this.setState({ stakingBalance: stakingBalance.toString() });
        } else {
            window.alert('Decentral Bank not deployed to the network');
        }
        this.setState({ loading: false });
    }

    stakeTokens = (amount) => {
        if (!this.state.hasMetaMask) {
            window.alert('Please install MetaMask to use this feature!');
            return;
        }
        this.setState({ loading: true });
        this.state.tether.methods.approve(this.state.decentralBank._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
            this.state.decentralBank.methods.depositTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
                this.setState({ loading: false });
            });
        });
    }

    unstakeTokens = () => {
        if (!this.state.hasMetaMask) {
            window.alert('Please install MetaMask to use this feature!');
            return;
        }
        this.setState({ loading: true });
        this.state.decentralBank.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
            this.setState({ loading: false });
        });
    }

    render() {
        let content = this.state.loading ? (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                color: this.state.darkMode ? '#f0abfc' : '#9333ea',
                fontSize: '18px',
                fontWeight: '500'
            }}>
                <p>Loading VaultVerse...</p>
            </div>
        ) : (
            <Main
                tetherBalance={this.state.tetherBalance}
                rwdBalance={this.state.rwdBalance}
                stakingBalance={this.state.stakingBalance}
                stakeTokens={this.stakeTokens}
                unstakeTokens={this.unstakeTokens}
                darkMode={this.state.darkMode}
                hasMetaMask={this.state.hasMetaMask}
            />
        );

        return (
            <div style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                flexDirection: 'column',
                background: this.state.darkMode 
                    ? 'linear-gradient(135deg, #312e81 0%, #581c87 50%, #4c1d95 100%)'
                    : 'linear-gradient(135deg, #e0e7ff 0%, #f5d0fe 50%, #e9d5ff 100%)',
                transition: 'all 0.3s ease'
            }}>
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 1000
                }}>
                    <button
                        onClick={this.toggleTheme}
                        style={{
                            background: this.state.darkMode 
                                ? 'rgba(255, 255, 255, 0.1)' 
                                : 'rgba(255, 255, 255, 0.5)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            transform: 'scale(1)',
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        {this.state.darkMode ? <SunIcon /> : <MoonIcon />}
                    </button>
                </div>
                <Navbar account={this.state.account} darkMode={this.state.darkMode} />
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <div style={{
                        width: '100%',
                        maxWidth: '600px',
                        position: 'relative'
                    }}>
                        {!this.state.hasMetaMask && (
                            <div style={{
                                padding: '10px',
                                marginBottom: '20px',
                                background: 'rgba(255, 87, 87, 0.1)',
                                border: '1px solid rgba(255, 87, 87, 0.3)',
                                borderRadius: '8px',
                                color: this.state.darkMode ? '#fca5a5' : '#dc2626',
                                textAlign: 'center'
                            }}>
                                Please install <a 
                                    href="https://metamask.io"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: 'inherit',
                                        textDecoration: 'underline',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    MetaMask
                                </a> to access all features
                            </div>
                        )}
                        {content}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
