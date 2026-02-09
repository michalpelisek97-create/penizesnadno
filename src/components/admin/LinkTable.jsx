import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, ExternalLink, GripVertical } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const categoryLabels = {
  crypto: 'Kryptoměny',
  banks: 'Banky',
  cashback: 'Cashback',
  games: 'Hry',
  shopping: 'Nákupy',
  other: 'Ostatní'
};

const categoryColors = {
  crypto: 'bg-amber-100 text-amber-800',
  banks: 'bg-emerald-100 text-emerald-800',
  cashback: 'bg-pink-100 text-pink-800',
  games: 'bg-purple-100 text-purple-800',
  shopping: 'bg-blue-100 text-blue-800',
  other: 'bg-slate-100 text-slate-800'
};

export default function LinkTable({ links, onEdit, onRefresh }) {
  const handleToggleActive = async (link) => {
    await base44.entities.ReferralLink.update(link.id, { is_active: !link.is_active });
    toast.success(link.is_active ? 'Odkaz skryt' : 'Odkaz zobrazen');
    onRefresh();
  };

  const handleDelete = async (link) => {
    if (window.confirm(`Opravdu chceš smazat "${link.title}"?`)) {
      await base44.entities.ReferralLink.delete(link.id);
      toast.success('Odkaz byl smazán');
      onRefresh();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="w-12"></TableHead>
            <TableHead>Odkaz</TableHead>
            <TableHead>Kategorie</TableHead>
            <TableHead className="text-center">Aktivní</TableHead>
            <TableHead className="text-right">Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => (
            <TableRow key={link.id} className="group">
              <TableCell>
                <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-400 cursor-grab" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  {link.image_url ? (
                    <img 
                      src={link.image_url} 
                      alt={link.title}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-100"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-400">
                        {link.title?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-900">{link.title}</p>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
                    >
                      {link.url?.substring(0, 40)}...
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={categoryColors[link.category]}>
                  {categoryLabels[link.category]}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Switch
                  checked={link.is_active}
                  onCheckedChange={() => handleToggleActive(link)}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(link)}
                    className="h-8 w-8 text-slate-500 hover:text-slate-900"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(link)}
                    className="h-8 w-8 text-slate-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {links.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                Zatím nemáš žádné odkazy. Přidej první!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}