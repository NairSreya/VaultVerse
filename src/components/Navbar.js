import React, { Component } from 'react';


class Navbar extends Component {
  render() {
    return (
      <nav
        className="navbar fixed-top shadow p-0"
        style={{
          background: 'linear-gradient(135deg, #312e81 0%, #581c87 50%, #4c1d95 100%)', // Soft retro pastel background
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          position: 'relative',
        }}
      >
        {/* Brand Logo */}
        <a
  href="/"
  style={{
    color: '#F5F5F5', // off white
    //border: 'black',
    fontSize: '2rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    fontFamily: `'Orbitron', sans-serif`, // Futuristic font
    textShadow: ' black, 0 0 30px #ede8f5', // Glowing effect
  }}
>
  VaultVerse
</a>



        {/* Account Info */}
        <ul style={{ listStyleType: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center' }}>
          <li>
            <small
              style={{
                color: '#F5F5F5', 
                fontSize: '1rem',
                fontWeight: 'bold',
                fontFamily: `'Roboto', sans-serif`,
                background: 'linear-gradient(0 0 20px #adbbda, 0 0 30px #8697c4)',
                padding: '5px 10px',
                borderRadius: '8px',
                color: '#F5F5F5',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              Account Number: {this.props.account}
            </small>
          </li>
        </ul>

        {/* Optional Accent Circle */}
        <div
          style={{
            position: 'absolute',
            top: '-30px',
            right: '-40px',
            width: '100px',
            height: '100px',
            background: 'radial-gradient(circle, #f0abfc, #ff9a8b)',
            borderRadius: '50%',
            zIndex: '-1',
          }}
        ></div>
      </nav>
    );
  }
}

export default Navbar;
