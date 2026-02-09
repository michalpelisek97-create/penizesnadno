import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bitcoin, 
  Building2, 
  Percent, 
  Gamepad2, 
  ShoppingBag, 
  LayoutGrid,
  Sparkles
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'Vše', icon: LayoutGrid },
  { id: 'crypto', label: 'Kryptoměny', icon: Bitcoin },
  { id: 'banks', label: 'Banky', icon: Building2 },
  { id: 'cashback', label: 'Cashback', icon: Percent },
  { id: 'games', label: 'Hry', icon: Gamepad2 },
  { id: 'shopping', label: 'Nákupy', icon: ShoppingBag },
];

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selected === category.id;
        
        return (
          <motion.button
            key={category.id}
            onClick={() => onSelect(category.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
              flex items-center gap-2
              ${isSelected 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'bg-white/60 text-slate-600 hover:bg-white hover:text-slate-900 border border-slate-200/60'
              }
            `}
          >
            {isSelected && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-slate-900 rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {category.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}