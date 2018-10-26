import React, { Component } from 'react';
import './App.css';
import contract from './lottery';
import web3Wrapper from './web3';

class App extends Component {

  // No need for constructor
  state = { 
    lotteryOwnerAddress: '',
    jackPot: '',
    players: [],
    value: '0',
    message: ''
  };

  playLottery = async (event) =>
  {
    event.preventDefault();
    
    console.log('playLottery');

    const accounts = await web3Wrapper.eth.getAccounts();

    // This should be the default account
    const defaultAccount = accounts[0];

    this.setState({ message: 'Waiting on transaction success...'});

    try {
      await contract.methods.play().send({
        from: defaultAccount,
        value: web3Wrapper.utils.toWei(this.state.value, 'ether')
      });

      this.setState({ message: 'You have been entered!'});
    }
    catch (exc) {
      this.setState({ message: exc});
    }

  };

  pickWinner = async (event) =>
  {
    console.log('pickWinner');

    const accounts = await web3Wrapper.eth.getAccounts();

    // This should be the default account
    const defaultAccount = accounts[0];

    this.setState({ message: 'Waiting on transaction success...'});

    try {
      await contract.methods.drawLottery().send({
        from: defaultAccount
      });

      this.setState({ message: 'A winner has been picked!'});
    }
    catch (exc) {
      this.setState({ message: exc});
    }

  };
  
  async componentDidMount() {
    
    const lotteryOwnerAddress = await contract.methods.getLotteryOwner().call();
    const jackPot = await contract.methods.getBalance().call();
    const players = await contract.methods.getPlayers().call();

    this.setState( {
       lotteryOwnerAddress,
       jackPot,
       players
      });

  }

  render() {
    return (
      <div>
        <h2>This is our lottery contract</h2>
        <p>This contract is owned by {this.state.lotteryOwnerAddress}.</p>
        <p>The jackpot's amount is {web3Wrapper.utils.fromWei(this.state.jackPot, 'ether')} ether with {this.state.players.length} people playing.</p>
        <hr/>
        <form onSubmit={this.playLottery}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to play</label>
            <input 
              value={this.state.value}
              onChange={event => this.setState({value: event.target.value
            })}/>
          </div>
          <button>Enter</button>
        </form>
        <hr/>
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.pickWinner}>Pick a winner!</button>
        <hr/>
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
