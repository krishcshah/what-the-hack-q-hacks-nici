/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import HomeView from './components/HomeView';
import CartView from './components/CartView';
import Navigation from './components/Navigation';
import InitialLoader from './components/InitialLoader';
import WelcomeScreen from './components/WelcomeScreen';
import AdjustmentLoader from './components/AdjustmentLoader';
import GlobalVoiceAgent from './components/GlobalVoiceAgent';
import CameraScanner from './components/CameraScanner';
import MinOrderLoader from './components/MinOrderLoader';
import HamburgerLoader from './components/HamburgerLoader';
import Onboarding from './components/Onboarding';
import InvestorPitchFlowchart from './components/InvestorPitchFlowchart';
import { generateMockCart, applyAdjustment } from './data';
import { CartState, CartCategory } from './types';

export default function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('onboardingComplete') === 'true';
  });
  const [appPhase, setAppPhase] = useState<'loading' | 'welcome' | 'main'>('loading');
  const [currentTab, setCurrentTab] = useState('home');
  const [cartCategories, setCartCategories] = useState<CartCategory[]>(generateMockCart());
  
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<string | null>(null);
  const [pendingCategories, setPendingCategories] = useState<CartCategory[] | null>(null);
  
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const cartState = useMemo<CartState>(() => {
    let totalPrice = 0;
    let itemCount = 0;
    cartCategories.forEach(cat => {
      cat.items.forEach(item => {
        totalPrice += item.price;
        itemCount += 1;
      });
    });
    return { categories: cartCategories, totalPrice, itemCount };
  }, [cartCategories]);

  const handleAdjust = (type: string) => {
    if (type === 'duplicate') {
      setIsCameraActive(true);
      return;
    }
    const newCat = applyAdjustment(cartCategories, type);
    setPendingCategories(newCat);
    setAdjustmentType(type);
    setIsAdjusting(true);
  };

  const handleVoiceAction = (action: any) => {
    if (typeof action === 'string') {
      handleAdjust(action);
    } else if (action && action.type === 'preset') {
      handleAdjust(action.payload);
    } else if (action && action.type === 'update_cart') {
      setPendingCategories(action.payload);
      setAdjustmentType('custom');
      setIsAdjusting(true);
    }
  };

  const handleCameraComplete = () => {
    setIsCameraActive(false);
    const newCat = applyAdjustment(cartCategories, 'duplicate');
    setPendingCategories(newCat);
    setAdjustmentType('duplicate');
    setIsAdjusting(true);
  };

  const finalizeAdjustment = () => {
    if (pendingCategories) {
      setCartCategories(pendingCategories);
    }
    setIsAdjusting(false);
    setAdjustmentType(null);
    setPendingCategories(null);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setHasCompletedOnboarding(true);
  };

  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="font-sans text-gray-900 antialiased selection:bg-red-100 selection:text-red-900 max-w-md mx-auto relative bg-white shadow-2xl min-h-screen overflow-hidden">
      {appPhase === 'loading' && (
        <InitialLoader cartState={cartState} onComplete={() => setAppPhase('welcome')} />
      )}

      <AnimatePresence>
        {appPhase === 'welcome' && (
          <WelcomeScreen onComplete={() => setAppPhase('main')} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVoiceActive && (
          <GlobalVoiceAgent 
            isActive={isVoiceActive} 
            onClose={() => setIsVoiceActive(false)}
            cartState={cartState}
            onAction={handleVoiceAction}
          />
        )}
        {isCameraActive && (
          <CameraScanner 
            onComplete={handleCameraComplete}
            onCancel={() => setIsCameraActive(false)}
          />
        )}
      </AnimatePresence>

      {isAdjusting && pendingCategories && adjustmentType === 'min-order' && (
        <MinOrderLoader onComplete={finalizeAdjustment} />
      )}

      {isAdjusting && pendingCategories && adjustmentType === 'add-hamburger' && (
        <HamburgerLoader onComplete={finalizeAdjustment} />
      )}

      {isAdjusting && pendingCategories && adjustmentType !== 'min-order' && adjustmentType !== 'add-hamburger' && (
        <AdjustmentLoader 
          oldCategories={cartCategories} 
          newCategories={pendingCategories} 
          onComplete={finalizeAdjustment} 
        />
      )}

      <div style={{ display: isAdjusting || appPhase !== 'main' ? 'none' : 'block' }}>
        {currentTab === 'home' && (
          <HomeView 
            cartState={cartState} 
            onGoToCart={() => setCurrentTab('cart')} 
            onMicClick={() => setIsVoiceActive(true)}
          />
        )}
        {currentTab === 'cart' && (
          <CartView 
            cartState={cartState} 
            onAdjust={handleAdjust} 
            onMicClick={() => setIsVoiceActive(true)}
          />
        )}
        {currentTab === 'pitch' && (
          <InvestorPitchFlowchart />
        )}
        
        <Navigation currentTab={currentTab} setTab={setCurrentTab} />
      </div>
    </div>
  );
}
