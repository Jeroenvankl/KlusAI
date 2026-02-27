'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import { Wallet, Calculator, Leaf, TrendingUp, Plus, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface Project {
  id: string;
  name: string;
  budget: number;
  spent: number;
  eco: number;
}

const INITIAL_PROJECTS: Project[] = [
  { id: '1', name: 'Woonkamer renovatie', budget: 2500, spent: 1240, eco: 72 },
  { id: '2', name: 'Badkamer opknappen', budget: 5000, spent: 0, eco: 0 },
];

export default function BudgetPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBudget, setNewBudget] = useState('');

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
  const avgEco = projects.filter((p) => p.eco > 0).reduce((s, p, _, a) => s + p.eco / a.length, 0);

  const addProject = () => {
    if (!newName || !newBudget) return;
    setProjects([
      ...projects,
      {
        id: Date.now().toString(),
        name: newName,
        budget: parseFloat(newBudget) || 0,
        spent: 0,
        eco: 0,
      },
    ]);
    setNewName('');
    setNewBudget('');
    setShowAdd(false);
  };

  return (
    <div>
      <PageHeader
        title="Budget & Duurzaamheid"
        subtitle="Beheer je budget en kies duurzame opties"
        icon={Wallet}
        gradient={['#FDCB6E', '#F39C12']}
      />

      <div className="px-4 md:px-8 space-y-6 pb-8">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '\uD83D\uDCB0', value: `\u20AC${totalBudget.toLocaleString('nl-NL')}`, label: 'Totaal budget', color: '#F39C12' },
            { icon: '\uD83D\uDCCA', value: `\u20AC${totalSpent.toLocaleString('nl-NL')}`, label: 'Besteed', color: '#4A90D9' },
            { icon: '\uD83C\uDF31', value: avgEco > 0 ? `${Math.round(avgEco)}%` : '\u2014', label: 'Eco-score', color: '#27AE60' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-3 border border-[#E5E7EB] text-center"
            >
              <span className="text-xl block">{stat.icon}</span>
              <p className="text-base font-bold mt-1" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-[10px] text-[#9CA3AF]">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/budget/calculator">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl p-4 shadow-md text-white relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #FDCB6E, #F39C12)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <Calculator size={24} className="mb-2 relative z-10" />
              <p className="text-sm font-bold relative z-10">Calculator</p>
              <p className="text-xs text-white/70 mt-0.5 relative z-10">Kosten berekenen</p>
            </motion.div>
          </Link>
          <Link href="/budget/eco">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl p-4 shadow-md bg-white border border-[#E5E7EB]"
            >
              <Leaf size={24} className="text-[#27AE60] mb-2" />
              <p className="text-sm font-bold text-[#1A1A2E]">Eco-tips</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">Duurzaam klussen</p>
            </motion.div>
          </Link>
        </div>

        {/* Projects */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[#1A1A2E]">Projecten</h2>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-1 text-xs font-medium text-[#F39C12] hover:text-[#E67E22] transition-colors"
            >
              <Plus size={14} />
              Toevoegen
            </button>
          </div>

          {/* Add project form */}
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-3 overflow-hidden"
            >
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Projectnaam"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] text-sm text-[#1A1A2E] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F39C12]/30"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Budget (\u20AC)"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] text-sm text-[#1A1A2E] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F39C12]/30"
                  />
                  <button
                    onClick={addProject}
                    className="px-4 py-2 bg-[#F39C12] text-white text-sm font-medium rounded-lg hover:bg-[#E67E22] transition-colors"
                  >
                    Toevoegen
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Project cards */}
          <div className="space-y-3">
            {projects.map((project, i) => {
              const progress = project.budget > 0 ? project.spent / project.budget : 0;
              const isOverBudget = progress > 0.8;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href="/budget/calculator">
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-sm transition-shadow group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-[#1A1A2E]">{project.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#F39C12]">
                            {'\u20AC'}{project.budget.toLocaleString('nl-NL')}
                          </span>
                          <ChevronRight size={14} className="text-[#9CA3AF] group-hover:text-[#1A1A2E] transition-colors" />
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden mb-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(progress * 100, 100)}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                          className={clsx(
                            'h-full rounded-full',
                            isOverBudget ? 'bg-[#EF4444]' : 'bg-[#4A90D9]',
                          )}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#6B7280]">
                          {'\u20AC'}{project.spent.toLocaleString('nl-NL')} besteed
                        </span>
                        {project.eco > 0 && (
                          <span className="text-xs text-[#27AE60] font-medium">
                            {'\uD83C\uDF31'} {project.eco}%
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Budget overview bar */}
        {totalSpent > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-[#F39C12]" />
              <span className="text-sm font-bold text-[#1A1A2E]">Totaaloverzicht</span>
            </div>
            <div className="h-3 bg-[#F3F4F6] rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
                transition={{ duration: 1 }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #FDCB6E, #F39C12)' }}
              />
            </div>
            <div className="flex justify-between text-xs text-[#6B7280]">
              <span>{'\u20AC'}{totalSpent.toLocaleString('nl-NL')} besteed</span>
              <span>{'\u20AC'}{(totalBudget - totalSpent).toLocaleString('nl-NL')} over</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
