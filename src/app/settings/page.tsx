'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useProfile, saveProfile } from '@/lib/hooks/useProfile';
import { useTheme } from '@/components/layout/ThemeProvider';
import { exportAllData, importData } from '@/lib/utils/exportImport';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Moon, Sun, Download, Upload, User, Scale, Dumbbell, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const profile = useProfile();
  const { theme, toggleTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [weight, setWeight] = useState(profile?.bodywightKg?.toString() ?? '');
  const [unit, setUnit] = useState<'kg' | 'lb'>(profile?.weightUnit ?? 'kg');
  const [injuries, setInjuries] = useState(profile?.injuryLimitations ?? '');
  const [days, setDays] = useState(profile?.trainingDaysPerWeek ?? 3);

  if (profile && weight === '' && profile.bodywightKg) {
    setWeight(profile.bodywightKg.toString());
  }

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await saveProfile({
        ...profile,
        bodywightKg: parseFloat(weight) || profile.bodywightKg,
        weightUnit: unit,
        injuryLimitations: injuries,
        trainingDaysPerWeek: days,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportAllData();
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportStatus('Importing…');
    try {
      await importData(file);
      setImportStatus('✅ Import successful! Reloading page…');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      setImportStatus(`❌ Import failed: ${err.message}`);
    }
  };

  return (
    <div className="page-content px-4 flex flex-col gap-5 max-w-lg mx-auto">
      <div className="pt-2">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Preferences & local data backup</p>
      </div>

      {/* Theme Settings */}
      <Card variant="elevated">
        <h2 className="font-extrabold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
          {theme === 'dark' ? <Moon size={20} className="text-indigo-400" /> : <Sun size={20} className="text-amber-500" />}
          Appearance Mode
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">Theme Mode</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Currently: <strong className="capitalize">{theme} Mode</strong></p>
          </div>
          <button
            id="dark-mode-toggle"
            onClick={toggleTheme}
            className={`relative w-14 h-8 rounded-full transition-all cursor-pointer border border-slate-300 dark:border-slate-700 ${
              theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-200'
            }`}
          >
            <motion.div
              layout
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
              animate={{ left: theme === 'dark' ? '28px' : '3px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          </button>
        </div>
      </Card>

      {/* Profile Settings */}
      <Card variant="elevated">
        <h2 className="font-extrabold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
          <User size={20} className="text-indigo-500" />
          Training Profile
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bodyweight</label>
              <input
                id="settings-weight"
                type="number"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="h-12 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-base shadow-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unit</label>
              <div className="flex h-12">
                {(['kg', 'lb'] as const).map((u) => (
                  <button
                    key={u}
                    id={`unit-${u}`}
                    onClick={() => setUnit(u)}
                    className={`w-14 rounded-2xl border-2 font-black text-sm transition-all cursor-pointer ${
                      unit === u
                        ? 'border-indigo-500 bg-indigo-600 text-white'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Days / Week</label>
            <div className="flex gap-2">
              {[2, 3, 4, 5, 6].map((d) => (
                <button
                  key={d}
                  id={`settings-days-${d}`}
                  onClick={() => setDays(d)}
                  className={`flex-1 h-11 rounded-2xl border-2 font-black text-sm transition-all cursor-pointer ${
                    days === d
                      ? 'border-indigo-500 bg-indigo-600 text-white'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Injury / Limitations</label>
            <textarea
              id="settings-injuries"
              value={injuries}
              onChange={(e) => setInjuries(e.target.value)}
              rows={2}
              className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium resize-none shadow-xs"
              placeholder="Current injuries or limitations…"
            />
          </div>

          <Button
            variant="primary"
            fullWidth
            onClick={handleSaveProfile}
            disabled={saving}
            id="settings-save-profile"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </Card>

      {/* Data Backup & Restore */}
      <Card variant="elevated">
        <h2 className="font-extrabold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
          <Scale size={20} className="text-emerald-500" />
          Local Data Sovereignty
        </h2>
        <div className="flex flex-col gap-3">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-start gap-3 text-amber-900 dark:text-amber-200">
            <ShieldCheck size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-relaxed">
              Your workout data lives strictly on your device. Export a backup JSON regularly to safeguard your progress.
            </p>
          </div>
          <Button
            variant="secondary"
            fullWidth
            onClick={handleExport}
            disabled={exporting}
            id="settings-export-btn"
          >
            <Download size={18} />
            {exporting ? 'Exporting…' : 'Export Data Backup (JSON)'}
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => fileRef.current?.click()}
            id="settings-import-btn"
          >
            <Upload size={18} />
            Restore From Backup
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
            id="settings-import-file"
          />
          {importStatus && (
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold text-center">{importStatus}</p>
          )}
        </div>
      </Card>

      {/* App Info */}
      <Card variant="glass">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shrink-0 glow-indigo">
            <Dumbbell size={24} className="text-white" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-black text-slate-900 dark:text-white text-base">Muscle Coach</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">v1.0 Hypertrophy Engine · PWA Ready</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
