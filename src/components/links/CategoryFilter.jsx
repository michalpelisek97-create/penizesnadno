import React from 'react';
import { 
  Bitcoin, 
  Building2, 
  Percent, 
  Gamepad2, 
  Smartphone, 
  LayoutGrid, 
  FileText,
  ShoppingBag // Přidaná ikona pro nákupy
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'Vše', icon: LayoutGrid },
  { id: 'banks', label: 'Banky', icon: Building2, hot: true },
  { id: 'crypto', label: 'Kryptoměny', icon: Bitcoin },
  { id: 'cashback', label: 'Cashback', icon: Percent },
  { id: 'Nákup levně', label: 'Nákup levně', icon: ShoppingBag, new: true }, // Nová kategorie
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
          <button
              key={category.id}
              onClick={() => onSelect(category.id)}
              className={`
              relative px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300
              flex items-center gap-2 overflow-visible
              ${isSelected 
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
              }
              ${category.hot && !isSelected ? 'ring-2 ring-indigo-500/20' : ''}
            `}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
              {category.label}
            </span>

            {/* Štítek pro TOP (Banky) */}
            {category.hot && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-[10px] text-white px-2 py-0.5 rounded-full shadow-md font-black z-20 animate-bounce">
                TOP
              </span>
            )}

            {/* Štítek pro NOVÉ (Nákup levně) */}
            {category.new && !isSelected && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-[10px] text-white px-2 py-0.5 rounded-full shadow-md font-black z-20">
                NOVÉ
              </span>
            )}
            </button>
        );
      })}
    </div>
  );
}