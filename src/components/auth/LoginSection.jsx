import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, LogIn } from 'lucide-react';

export default function LoginSection() {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        if (currentUser) {
          // Najít nebo vytvořit kredity pro uživatele
          const userCredits = await base44.entities.UserCredits.filter({ email: currentUser.email });
          if (userCredits.length > 0) {
            setCredits(userCredits[0]);
            
            // Subscribe na změny kreditu
            const unsubscribe = base44.entities.UserCredits.subscribe((event) => {
              if (event.id === userCredits[0].id) {
                setCredits(event.data);
              }
            });
            
            return unsubscribe;
          } else {
            // Vytvořit nový záznam kreditu
            const newCredits = await base44.entities.UserCredits.create({
              email: currentUser.email,
              balance: 0,
              total_earned: 0
            });
            setCredits(newCredits);
            
            // Subscribe na změny nového kreditu
            const unsubscribe = base44.entities.UserCredits.subscribe((event) => {
              if (event.id === newCredits.id) {
                setCredits(event.data);
              }
            });
            
            return unsubscribe;
          }
        }
      } catch (error) {
        console.log('Uživatel není přihlášen');
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribePromise = fetchUserData();
    
    return () => {
      unsubscribePromise.then(unsub => {
        if (typeof unsub === 'function') unsub();
      });
    };
  }, []);

  const handleLogin = () => {
    base44.auth.redirectToLogin();
  };

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <div className="mb-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/50 rounded-xl p-6 text-center">
        <p className="text-white mb-4 font-medium">Přihlaste se a získejte kredity za každý spin!</p>
        <Button 
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2"
        >
          <LogIn className="w-4 h-4" />
          Přihlásit se
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-8 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-400/50 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wallet className="w-6 h-6 text-emerald-300" />
          <div className="text-left">
            <p className="text-sm text-emerald-100">Přihlášeni jako: <span className="font-bold text-white">{user.full_name}</span></p>
            <p className="text-2xl font-bold text-emerald-300">{credits?.balance || 0} kreditů</p>
          </div>
        </div>
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="border-red-400/50 text-red-300 hover:bg-red-900/20 gap-2"
        >
          <LogOut className="w-4 h-4" />
          Odhlásit
        </Button>
      </div>
    </div>
  );
}