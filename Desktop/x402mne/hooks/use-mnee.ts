'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { MneeContract, MNEE_CONTRACT_ADDRESS } from '@/lib/mnee-contract';
import { ethers } from 'ethers';

export function useMnee() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [mneeContract, setMneeContract] = useState<MneeContract | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  // Initialize contract
  useEffect(() => {
    if (!publicClient) return;

    try {
      // Convert Viem public client to ethers provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      let signer: ethers.Signer | undefined;

      if (walletClient && address) {
        signer = new ethers.BrowserProvider(window.ethereum).getSigner();
      }

      const contract = new MneeContract(provider, signer);
      setMneeContract(contract);
    } catch (error) {
      console.error('Failed to initialize MNEE contract:', error);
    }
  }, [publicClient, walletClient, address]);

  // Fetch balance
  const fetchBalance = useCallback(async () => {
    if (!mneeContract || !address) return;

    try {
      setLoading(true);
      const userBalance = await mneeContract.getBalance(address);
      setBalance(userBalance);
    } catch (error) {
      console.error('Failed to fetch MNEE balance:', error);
      setBalance('0');
    } finally {
      setLoading(false);
    }
  }, [mneeContract, address]);

  // Update balance when address changes
  useEffect(() => {
    if (isConnected && address) {
      fetchBalance();
    } else {
      setBalance('0');
    }
  }, [isConnected, address, fetchBalance]);

  // Transfer MNEE tokens
  const transfer = useCallback(async (to: string, amount: string) => {
    if (!mneeContract) {
      throw new Error('Contract not initialized');
    }

    try {
      setLoading(true);
      const tx = await mneeContract.transfer(to, amount);
      await tx.wait();
      await fetchBalance(); // Refresh balance after transfer
      return tx;
    } catch (error) {
      console.error('Transfer failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [mneeContract, fetchBalance]);

  // Approve spending
  const approve = useCallback(async (spender: string, amount: string) => {
    if (!mneeContract) {
      throw new Error('Contract not initialized');
    }

    try {
      setLoading(true);
      const tx = await mneeContract.approve(spender, amount);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Approval failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [mneeContract]);

  // Get allowance
  const getAllowance = useCallback(async (owner: string, spender: string) => {
    if (!mneeContract) {
      throw new Error('Contract not initialized');
    }

    return await mneeContract.getAllowance(owner, spender);
  }, [mneeContract]);

  // Get token info
  const getTokenInfo = useCallback(async () => {
    if (!mneeContract) {
      throw new Error('Contract not initialized');
    }

    return await mneeContract.getTokenInfo();
  }, [mneeContract]);

  return {
    // State
    balance,
    loading,
    isConnected,
    address,
    contract: mneeContract,

    // Actions
    transfer,
    approve,
    getAllowance,
    getTokenInfo,
    refreshBalance: fetchBalance,

    // Contract info
    contractAddress: MNEE_CONTRACT_ADDRESS,
  };
}