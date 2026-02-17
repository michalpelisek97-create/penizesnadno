import React from 'react';
import { motion } from 'framer-motion';
// Tady musí být LayoutGrid v seznamu:
import { 
  Bitcoin, 
  Building2, 
  Percent, 
  Gamepad2, 
  Smartphone, 
  LayoutGrid, 
  ClipboardList,
  FileText
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'Vše', icon: LayoutGrid },
  { id: 'crypto', label: 'Kryptoměny', icon: Bitcoin },
  { id: 'banks', label: 'Banky', icon: Building2, hot: true },
  { id: 'cashback', label: 'Cashback', icon: Percent },
  { id: 'games', label: 'Hry', icon: Gamepad2 },
  { id: 'apps', label: 'Aplikace', icon: Smartphone },
  { id: 'Článek', label: 'Články', icon: FileText },
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300
              flex items-center gap-2 overflow-visible
              ${isSelected 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
              }
              ${category.hot && !isSelected ? 'ring-2 ring-indigo-500/20 animate-pulse' : ''}
            `}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
              {category.label}
            </span>

            {category.hot && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-[10px] text-white px-2 py-0.5 rounded-full shadow-md font-black z-20 animate-bounce">
                TOP
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
