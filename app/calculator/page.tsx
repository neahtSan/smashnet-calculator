'use client';

import { BadmintonCostCalculator } from '@/components/BadmintonCostCalculator';
import { PlayerStats } from '@/types/interface';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';

export default function CalculatorPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get players from localStorage
    const savedPlayers = localStorage.getItem('calculatorPlayers');
    if (savedPlayers) {
      try {
        const parsedPlayers = JSON.parse(savedPlayers);
        // Keep the original order from the homepage
        setPlayers(parsedPlayers);
      } catch (error) {
        console.error('Error parsing players data:', error);
        router.push('/');
      }
    } else {
      router.push('/');
    }
    setIsLoading(false);
  }, [router]);

  const handleBackToResults = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <BadmintonCostCalculator
        isVisible={true}
        onClose={handleBackToResults}
        players={players}
        onBackToResults={handleBackToResults}
      />
    </div>
  );
} 