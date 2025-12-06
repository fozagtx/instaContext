import { ethers } from 'ethers';

// MNEE Token Contract Address on Ethereum
export const MNEE_CONTRACT_ADDRESS = '0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF';

// ERC-20 ABI for MNEE token interactions
export const MNEE_ABI = [
  // Standard ERC-20 functions
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
];

export interface MneeContractMethods {
  transfer(to: string, amount: string): Promise<ethers.TransactionResponse>;
  approve(spender: string, amount: string): Promise<ethers.TransactionResponse>;
  balanceOf(address: string): Promise<string>;
  allowance(owner: string, spender: string): Promise<string>;
}

export class MneeContract {
  private contract: ethers.Contract;
  private signer?: ethers.Signer;

  constructor(provider: ethers.Provider, signer?: ethers.Signer) {
    this.contract = new ethers.Contract(MNEE_CONTRACT_ADDRESS, MNEE_ABI, provider);
    this.signer = signer;
  }

  // Get contract with signer for write operations
  private getSignedContract(): ethers.Contract {
    if (!this.signer) {
      throw new Error('Signer required for write operations');
    }
    return this.contract.connect(this.signer);
  }

  // Read operations
  async getBalance(address: string): Promise<string> {
    const balance = await this.contract.balanceOf(address);
    return ethers.formatUnits(balance, 6); // MNEE has 6 decimals
  }

  async getAllowance(owner: string, spender: string): Promise<string> {
    const allowance = await this.contract.allowance(owner, spender);
    return ethers.formatUnits(allowance, 6);
  }

  async getTokenInfo() {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
      this.contract.decimals(),
      this.contract.totalSupply()
    ]);

    return {
      name,
      symbol,
      decimals: Number(decimals),
      totalSupply: ethers.formatUnits(totalSupply, 6)
    };
  }

  // Write operations
  async transfer(to: string, amount: string): Promise<ethers.TransactionResponse> {
    const signedContract = this.getSignedContract();
    const amountWei = ethers.parseUnits(amount, 6);
    return await signedContract.transfer(to, amountWei);
  }

  async approve(spender: string, amount: string): Promise<ethers.TransactionResponse> {
    const signedContract = this.getSignedContract();
    const amountWei = ethers.parseUnits(amount, 6);
    return await signedContract.approve(spender, amountWei);
  }

  async transferFrom(from: string, to: string, amount: string): Promise<ethers.TransactionResponse> {
    const signedContract = this.getSignedContract();
    const amountWei = ethers.parseUnits(amount, 6);
    return await signedContract.transferFrom(from, to, amountWei);
  }

  // Event listening
  onTransfer(callback: (from: string, to: string, value: string) => void) {
    this.contract.on('Transfer', (from, to, value) => {
      callback(from, to, ethers.formatUnits(value, 6));
    });
  }

  onApproval(callback: (owner: string, spender: string, value: string) => void) {
    this.contract.on('Approval', (owner, spender, value) => {
      callback(owner, spender, ethers.formatUnits(value, 6));
    });
  }

  removeAllListeners() {
    this.contract.removeAllListeners();
  }
}

// Utility functions
export function formatMneeAmount(amount: string): string {
  return parseFloat(amount).toFixed(2) + ' MNEE';
}

export function validateEthereumAddress(address: string): boolean {
  return ethers.isAddress(address);
}

export function generatePaymentMetadata(
  amount: string,
  recipient: string,
  purpose: string,
  agentId?: string
) {
  return {
    amount,
    recipient,
    purpose,
    agentId,
    timestamp: new Date().toISOString(),
    contract: MNEE_CONTRACT_ADDRESS
  };
}