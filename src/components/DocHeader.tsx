import React from 'react';
import { ShieldCheck, HeartPulse, Sparkles, BookOpen } from 'lucide-react';

export default function DocHeader() {
  return (
    <header id="clinical-header" className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title and Medical Badge */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
            <HeartPulse className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                Preventive Care Planner
              </h1>
              <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-1.5 py-0.5 text-xs font-semibold text-teal-800 ring-1 ring-inset ring-teal-600/25">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" /> Clinical Grade
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Evidence-Based Routine Screening Planner & Advisor • Current local time: May 2026
            </p>
          </div>
        </div>

        {/* Guideline Sources Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium mr-1.5">Guidelines:</span>
          <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">USPSTF</span>
          <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">AAFP</span>
          <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">WHO</span>
          <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">CDC</span>
        </div>
      </div>
    </header>
  );
}
