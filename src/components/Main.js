import React, { Component } from 'react';

class Main extends Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  formatBalance = (balance) => {
    try {
      return window.web3 ? window.web3.utils.fromWei(balance || '0') : '0';
    } catch (error) {
      return '0';
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    try {
      if (!window.web3) {
        console.error('Web3 is not initialized');
        return;
      }
      let amount = this.input.current.value.toString();
      amount = window.web3.utils.toWei(amount, 'Ether');
      this.props.stakeTokens(amount);
    } catch (error) {
      console.error('Error processing stake:', error);
    }
  };

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '84vh',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'linear-gradient(135deg, #312e81 0%, #581c87 50%, #4c1d95 100%)', // Indigo to purple gradient
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            width: '100%',
            maxWidth: '500px',
            overflow: 'hidden',
          }}
        >
          {/* Content Table */}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: '16px',
                    color: '#f0abfc', // Fuchsia-300
                    fontSize: '20px',
                    fontWeight: '500',
                    textAlign: 'center',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  Staking Balance
                </th>
                <th
                  style={{
                    padding: '16px',
                    color: '#f0abfc', // Fuchsia-300
                    fontSize: '20px',
                    fontWeight: '500',
                    textAlign: 'center',
                  }}
                >
                  Reward Balance
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <td
                  style={{
                    padding: '16px',
                    color: '#ffffff',
                    fontSize: '18px',
                    textAlign: 'center',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {this.formatBalance(this.props.stakingBalance)} ETH USDT
                </td>
                <td
                  style={{
                    padding: '16px',
                    color: '#ffffff',
                    fontSize: '18px',
                    textAlign: 'center',
                  }}
                >
                  {this.formatBalance(this.props.rwdBalance)} ETH RWD
                </td>
              </tr>
            </tbody>
          </table>

          {/* Form Section */}
          <div
            style={{
              padding: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <form onSubmit={this.handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                  }}
                >
                  <label
                    style={{
                      color: '#f0abfc', // Fuchsia-300
                      fontWeight: '500',
                    }}
                  >
                    Stake Tokens
                  </label>
                  <span style={{ color: '#ddd6fe' }}> {/* Violet-200 */}
                    Balance: {this.formatBalance(this.props.tetherBalance)} ETH
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <input
                    ref={this.input}
                    type="text"
                    placeholder="Enter amount"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = '0 0 0 2px rgba(240, 171, 252, 0.5)'; // Fuchsia glow
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                  }}
                >
                  <button
                    type="submit"
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(to right, #d946ef, #9333ea)', // Fuchsia to purple gradient
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: '500',
                      cursor: 'pointer',
                      flex: 1,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(217, 70, 239, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    DEPOSIT
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      this.props.unstakeTokens();
                    }}
                    style={{
                      padding: '12px 24px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontWeight: '500',
                      cursor: 'pointer',
                      flex: 1,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    WITHDRAW
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Paragraph at the bottom */}
        <p
          style={{
            marginTop: '20px',
            color: '#ffffff',
            fontSize: '16px',
            textAlign: 'center',
            padding: '20px',
            maxWidth: '600px',
          }}
        >
          VaultVerse is your digital crypto bank, where you can deposit ERC20 tokens, earn rewards like interest, and withdraw anytime—all on a secure and transparent blockchain platform.
        </p>
  
      </div>
    );
  }
}

export default Main;
