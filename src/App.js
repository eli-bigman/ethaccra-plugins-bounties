'use client'

import React, { useState } from "react";
import { Web3 } from "web3";
import { ORAPlugin, Chain, Models } from "@ora-io/web3-plugin-ora";
import { Box, TextField, Button, Typography } from '@mui/material';

export default function ImageGen() {
  const [prompt, setPrompt] = useState(""); // State for user prompt input
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false); 
  const [error, setError] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);

  const web3 = new Web3(window.ethereum);

  // Register plugin
  web3.registerPlugin(new ORAPlugin(Chain.SEPOLIA));

  async function generateImage() {
    if (!prompt) {
      setError("Prompt cannot be empty!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const estimateFee = await web3.ora.estimateFee(Models.STABLE_DIFFUSION);
      console.log("Fee estimated:", estimateFee);

      // Connect MetaMask
      const accounts = await web3.eth.requestAccounts();
      console.log("Accounts connected:", accounts);

      // Send transaction
      const receipt = await web3.ora.calculateAIResult(
        accounts[0],
        Models.STABLE_DIFFUSION,
        prompt,
        estimateFee
      );
      console.log("Transaction hash:", receipt.transactionHash);
      setTransactionHash(receipt.transactionHash);
    } catch (error) {
      setError(`Error generating image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function fetchResult() {
    if (!transactionHash) {
      setError("No image request found. Please generate an image first.");
      return;
    }

    setFetching(true); // Start loading for fetching
    setError(null);

    // Add a 30-second delay
    setTimeout(async () => {
      try {
        const result = await web3.ora.getAIResult(Models.STABLE_DIFFUSION, prompt);
        console.log("Result:", result); // Debugging line
        const ipfsUrl = `https://ipfs.io/ipfs/${result}`;
        console.log("Generated IPFS URL:", ipfsUrl); // Log the IPFS URL
        setImageUrl(ipfsUrl); // Set the generated image URL
      } catch (error) {
        setError(`Error fetching result: ${error.message}`);
      } finally {
        setFetching(false); // End loading for fetching
      }
    }, 30000); // 30-second delay
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" gap={2}>
      <TextField
        variant="outlined"
        label="Enter a prompt to generate an image"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        fullWidth
        sx={{ maxWidth: 400 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={generateImage}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? "Generating..." : "Generate AI Image"}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={fetchResult}
        disabled={fetching || loading || !transactionHash}
        sx={{ mt: 2 }}
      >
        {fetching ? "Fetching (30s wait)..." : "Fetch Result"}
      </Button>

      {error && <Typography color="error">{error}</Typography>}
      {fetching && <Typography>Loading... Please wait while we fetch the image.</Typography>}
      {imageUrl && (
        <Box mt={4}>
          <img src={imageUrl} alt="Generated AI" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
        </Box>
      )}
    </Box>
  );
}
