"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Wallet, CheckCircle } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useMnee } from '@/hooks/use-mnee';

export function MneeAccountChecker() {
  const { address, isConnected } = useAccount();
  const { balance, loading } = useMnee();

  return (
    <Card className="border-blue-500/50 bg-blue-950/40 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-blue-100">
              <Wallet className="w-5 h-5 text-blue-400" />
              MNEE Account
            </CardTitle>
            <CardDescription className="font-mono text-blue-300">
              Connect your Ethereum wallet to check MNEE balance
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <ConnectButton />
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-mono">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-blue-200">Connected</span>
            </div>
            <div className="border border-blue-500/50 rounded-lg p-4 space-y-2 bg-blue-900/30">
              <div>
                <div className="text-xs font-mono text-blue-300/60 mb-1">Address</div>
                <div className="text-sm font-mono text-blue-200 break-all">
                  {address}
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-blue-300/60 mb-1">MNEE Balance</div>
                <div className="text-lg font-sentient text-blue-400">
                  {loading ? 'Loading...' : `${parseFloat(balance).toFixed(2)} MNEE`}
                </div>
              </div>
            </div>
            <ConnectButton />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

