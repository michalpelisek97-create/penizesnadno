import React, { useState } from 'react';
import { Search, Calendar, TrendingUp, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdvancedFilters({ onFiltersChange, onClear }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [popularityMin, setPopularityMin] = useState(0);
  const [dateFrom, setDateFrom] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApplyFilters = () => {
    onFiltersChange({
      searchTerm: searchTerm.trim().toLowerCase(),
      sortBy,
      popularityMin: parseInt(popularityMin) || 0,
      dateFrom: dateFrom || null
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setSortBy('newest');
    setPopularityMin(0);
    setDateFrom('');
    onClear();
  };

  const isFiltersActive = searchTerm || sortBy !== 'newest' || popularityMin > 0 || dateFrom;

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <Input
          type="text"
          placeholder="Hledat bonusy, klíčová slova..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
          className="pl-10"
        />
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2"
      >
        <TrendingUp className="w-4 h-4" />
        {isExpanded ? 'Skrýt' : 'Zobrazit'} pokročilé filtry
        {isFiltersActive && (
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
            Aktivní
          </span>
        )}
      </button>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sort By */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Seřadit podle</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Nejnovější" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Nejnovější</SelectItem>
                  <SelectItem value="oldest">Nejstarší</SelectItem>
                  <SelectItem value="popular">Nejpopulárnější</SelectItem>
                  <SelectItem value="views">Nejvíce zobrazení</SelectItem>
                  <SelectItem value="alphabetical">Abecedně</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Popularity */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Minimální popularita: {popularityMin}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={popularityMin}
                onChange={(e) => setPopularityMin(e.target.value)}
                className="w-full accent-purple-600"
              />
            </div>

            {/* Date From */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Oddata
              </label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-end gap-2">
              <Button
                onClick={handleApplyFilters}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Filtrovat
              </Button>
              {isFiltersActive && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="icon"
                  title="Vymazat filtry"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}