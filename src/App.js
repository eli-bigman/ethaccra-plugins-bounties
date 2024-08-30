import React, { useState, useEffect } from "react";
import "./App.css";
import { Web3 } from "web3";
import { ORAPlugin, Chain, Models } from "@ora-io/web3-plugin-ora";

function App() {
  const [accounts, setAccounts] = useState([]);
  const [result, setResult] = useState(null);

  // initialize provider (RPC endpoint or injected provider)
  const web3 = new Web3(window.ethereum);

  // register plugin
  web3.registerPlugin(new ORAPlugin(Chain.SEPOLIA));

  

  async function usePlugin() {
    const PROMPT = "generate a quiz on any subject";

    const estimateFee = await web3.ora.estimateFee(Models.LLAMA2);
    console.log("fee", estimateFee);

    const accounts = await web3.eth.requestAccounts();

    //send tx
    const receipt = await web3.ora.calculateAIResult(accounts[0], Models.LLAMA2, PROMPT, estimateFee);
    console.log("transactionHash", receipt.transactionHash);
  }

  async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function fetchResult() {
    const PROMPT = "generate a quiz on any subject";

    console.log("Waiting for 30 seconds before fetching the result...");
    await delay(30000);

    const result = await web3.ora.getAIResult(Models.LLAMA2, PROMPT);
    console.log("Results...",result);
    setResult(result);
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={usePlugin}>Generate Quiz</button>
        <button onClick={fetchResult}>Fetch Result</button>
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      </header>
    </div>
  );
}

export default App;


// import React, { useState } from "react";
// import logo from "./logo.svg";
// import "./App.css";
// import { Web3 } from "web3";
// import { ORAPlugin, Chain, Models } from "@ora-io/web3-plugin-ora";

// function App() {
//   const [imageUrl, setImageUrl] = useState(null);

//   // initialize provider (RPC endpoint or injected provider)
//   const web3 = new Web3(window.ethereum);

//   // register plugin
//   web3.registerPlugin(new ORAPlugin(Chain.SEPOLIA));

//   async function usePlugin() {
//     const PROMPT = "generate an image of a person from ghana";

//     const estimateFee = await web3.ora.estimateFee(Models.STABLE_DIFFUSION);
//     console.log("fee", estimateFee);

//     //connect metamask
//     const accounts = await web3.eth.requestAccounts();
//     console.log("accounts connected:", accounts);

//     //send tx
//     const receipt = await web3.ora.calculateAIResult(accounts[0], Models.STABLE_DIFFUSION, PROMPT, estimateFee);
//     console.log(receipt.transactionHash);
//   }

//   async function fetchResult() {
//     //fetch result
//     const PROMPT = "generate an image of a person from ghana";

//     const result = await web3.ora.getAIResult(Models.STABLE_DIFFUSION, PROMPT);
//     console.log(result);
//     const ipfsUrl = `https://ipfs.io/ipfs/${result}`; 

//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <button onClick={usePlugin}>generate AI</button>
//         <button onClick={fetchResult}>fetch result</button>
//         {imageUrl && <img src={imageUrl} alt="Generated AI" />}
//       </header>
//     </div>
//   );
// }

// export default App;