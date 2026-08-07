'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useReviews } from '@/lib/hooks/useReviews';
import { useActiveProgram } from '@/lib/hooks/useActiveProgram';
import { useRecentSessions } from '@/lib/hooks/useToday';
import { db } from '@/lib/db/db';
import { generateWeeklyReview, generateMonthlyReview } from '@/lib/engine/reviewGenerator';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TrendingDown, Minus, Star, AlertTriangle, CheckCircle, RefreshCw, Sparkles } from 'lucide-react';
import { formatDisplayDate } from '@/lib/utils/dateHelpers';

export default function ReviewPage() {
  const reviews = useReviews(20);
  const program = useActiveProgram();
  const recentSessions = useRecentSessions(50);
  const [generating, setGenerating] = useState(false);

  const handleGenerateWeekly = async () => {
    if (!program || !recentSessions) return;
    setGenerating(true);
    try {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 6);

      const sessions = recentSessions.filter((s) => {
        const d = new Date(s.date + 'T00:00:00');
        return d >= weekStart && d <= now;
      });

      const allSetLogs = await db.setLogs
        .where('workoutSessionId')
        .anyOf(sessions.map((s) => s.id!))
        .toArray();

      const review = await generateWeeklyReview(
        sessions,
        allSetLogs,
        program.frequencyPerWeek,
        2,
        weekStart,
        now
      );
      await db.reviews.add(review);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateMonthly = async () => {
    if (!program || !recentSessions) return;
    setGenerating(true);
    try {
      const now = new Date();
      const monthStart = new Date(now);
      monthStart.setDate(now.getDate() - 28);

      const sessions = recentSessions.filter((s) => {
        const d = new Date(s.date + 'T00:00:00');
        return d >= monthStart && d <= now;
      });

      const allSetLogs = await db.setLogs
        .where('workoutSessionId')
        .anyOf(sessions.map((s) => s.id!))
        .toArray();

      const review = await generateMonthlyReview(
        sessions,
        allSetLogs,
        program.frequencyPerWeek,
        2,
        monthStart,
        now
      );
      await db.reviews.add(review);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="page-content px-4 flex flex-col gap-5 max-w-lg mx-auto">
      <div className="pt-2">
        <h1 className="text-2xl font-black text-white tracking-tight">Coaching Reviews</h1>
        <p className="text-slate-400 text-xs font-medium">Rule-based analytical evaluations</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleGenerateWeekly}
          disabled={generating}
          className="flex-1"
          id="gen-weekly-review"
        >
          <RefreshCw size={14} /> Generate Weekly
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleGenerateMonthly}
          disabled={generating}
          className="flex-1"
          id="gen-monthly-review"
        >
          <RefreshCw size={14} /> Generate Monthly
        </Button>
      </div>

      {/* Reviews List */}
      {(reviews ?? []).length === 0 ? (
        <Card variant="elevated" className="text-center py-12">
          <Star size={44} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-bold text-base mb-1">No Reviews Generated Yet</p>
          <p className="text-slate-500 text-xs max-w-xs mx-auto">
            Log workouts and trigger your first weekly coaching evaluation above.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {(reviews ?? []).map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card variant="elevated" className="border-indigo-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                    review.type === 'monthly'
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-indigo-500/20 text-indigo-400'
                  }`}>
                    <Star size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-white text-base capitalize">{review.type} Review</p>
                      <Badge variant={review.type === 'monthly' ? 'purple' : 'info'} size="sm">
                        {review.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      {formatDisplayDate(review.periodStart)} – {formatDisplayDate(review.periodEnd)}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 mb-3">
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                    {review.generatedSummary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {review.decisions.deloadTriggered && (
                    <Badge variant="warning" size="sm">
                      <AlertTriangle size={12} /> Deload Triggered
                    </Badge>
                  )}
                  {review.decisions.plateauExerciseIds.length > 0 && (
                    <Badge variant="danger" size="sm">
                      <TrendingDown size={12} /> {review.decisions.plateauExerciseIds.length} Plateau(s)
                    </Badge>
                  )}
                  {review.decisions.nextPhaseRecommended && (
                    <Badge variant="success" size="sm">
                      <CheckCircle size={12} /> Ready for Phase 2
                    </Badge>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
