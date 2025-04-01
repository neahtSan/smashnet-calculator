'use client';

import { BadmintonCostCalculator } from '@/components/BadmintonCostCalculator';
import { PlayerStats } from '@/interface';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spin, Modal } from 'antd';

export default function CalculatorPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

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

    // Add beforeunload event listener
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [router]);

  const handleBackToResults = () => {
    setIsConfirmModalVisible(true);
  };

  const handleConfirmBack = () => {
    localStorage.removeItem('calculatorPlayers');
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
      <Modal
        title="Leave Calculator?"
        open={isConfirmModalVisible}
        onOk={handleConfirmBack}
        onCancel={() => setIsConfirmModalVisible(false)}
      >
        <p>If you leave now, all player data will be lost. Are you sure you want to continue?</p>
      </Modal>
    </div>
  );
} 