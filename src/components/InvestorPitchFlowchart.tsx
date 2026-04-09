/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChevronDown, Zap, Mic, Camera, ShoppingCart, Leaf, TrendingUp } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FlowNode {
  id: string;
  label: string;
  sublabel?: string;
  color: string;          // Tailwind bg class
  textColor: string;      // Tailwind text class
  borderColor: string;    // Tailwind border class
  icon?: React.ReactNode;
  bullets?: string[];
  wide?: boolean;
}

// ─── Connector Arrow ─────────────────────────────────────────────────────────

function Arrow() {
  return (
    <div className="flex flex-col items-center my-1">
      <div className="w-0.5 h-4 bg-gray-300" />
      <ChevronDown size={16} className="text-gray-400 -mt-1" />
    </div>
  );
}

// ─── Flowchart Node ──────────────────────────────────────────────────────────

function FlowNode({ node }: { node: FlowNode }) {
  return (
    <div
      className={`w-full rounded-2xl border-2 ${node.borderColor} ${node.color} px-4 py-3 shadow-sm`}
    >
      <div className="flex items-center gap-2 mb-1">
        {node.icon && (
          <span className={`${node.textColor} opacity-80`}>{node.icon}</span>
        )}
        <span className={`font-bold text-sm ${node.textColor}`}>{node.label}</span>
      </div>
      {node.sublabel && (
        <p className={`text-xs ${node.textColor} opacity-75 leading-snug`}>{node.sublabel}</p>
      )}
      {node.bullets && node.bullets.length > 0 && (
        <ul className="mt-1.5 space-y-0.5">
          {node.bullets.map((b, i) => (
            <li key={i} className={`text-xs ${node.textColor} opacity-80 flex items-start gap-1`}>
              <span className="mt-0.5 shrink-0">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Branching section (Adjustment options) ──────────────────────────────────

function AdjustmentBranch() {
  const options = [
    {
      icon: <Mic size={14} />,
      label: 'Voice Agent',
      desc: 'Talk to adjust cart',
      bg: 'bg-violet-50',
      border: 'border-violet-300',
      text: 'text-violet-700',
    },
    {
      icon: <Camera size={14} />,
      label: 'Camera Scan',
      desc: 'Remove duplicates',
      bg: 'bg-pink-50',
      border: 'border-pink-300',
      text: 'text-pink-700',
    },
    {
      icon: <Zap size={14} />,
      label: 'AI Presets',
      desc: 'Save, Eco, Premium',
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-700',
    },
  ];

  return (
    <div className="w-full">
      {/* top connector */}
      <div className="flex justify-center">
        <div className="w-0.5 h-4 bg-gray-300" />
      </div>

      {/* horizontal bar */}
      <div className="relative flex items-center justify-between px-6">
        <div className="absolute left-6 right-6 top-1/2 h-0.5 bg-gray-300" />
        {options.map((opt) => (
          <div key={opt.label} className="relative flex flex-col items-center gap-1">
            <div className="w-0.5 h-4 bg-gray-300" />
            <div
              className={`rounded-xl border-2 ${opt.border} ${opt.bg} px-2 py-2 flex flex-col items-center gap-0.5 w-24 shadow-sm`}
            >
              <span className={`${opt.text}`}>{opt.icon}</span>
              <span className={`text-[10px] font-bold ${opt.text}`}>{opt.label}</span>
              <span className={`text-[9px] ${opt.text} opacity-70 text-center leading-tight`}>
                {opt.desc}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* merge lines back down */}
      <div className="relative flex items-start justify-between px-6">
        <div className="absolute left-6 right-6 bottom-0 h-0.5 bg-gray-300" />
        {options.map((opt) => (
          <div key={opt.label} className="flex justify-center w-24">
            <div className="w-0.5 h-4 bg-gray-300" />
          </div>
        ))}
      </div>

      {/* merge arrow */}
      <div className="flex flex-col items-center">
        <div className="w-0.5 h-2 bg-gray-300" />
        <ChevronDown size={16} className="text-gray-400 -mt-1" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InvestorPitchFlowchart() {
  const topNodes: FlowNode[] = [
    {
      id: 'problem',
      label: '😩 The Problem',
      sublabel: 'Traditional grocery shopping wastes 2+ hrs/week per household.',
      bullets: [
        'Repetitive, manual cart building',
        'No personalisation for diet or budget',
        'Forgotten items & over-ordering',
      ],
      color: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-300',
    },
    {
      id: 'solution',
      label: '✨ The Solution — Nici',
      sublabel: 'An agentic AI assistant that builds, adjusts & confirms your grocery order automatically.',
      color: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-300',
      icon: <Zap size={16} />,
    },
  ];

  const journeyNodes: FlowNode[] = [
    {
      id: 'onboard',
      label: '1 · Smart Onboarding',
      sublabel: 'User sets household size, dietary preferences (Vegan/Omni/Vegetarian), and links calendar.',
      color: 'bg-indigo-50',
      textColor: 'text-indigo-800',
      borderColor: 'border-indigo-300',
    },
    {
      id: 'ai-cart',
      label: '2 · AI Cart Generation',
      sublabel: 'GPT-4o-mini builds a personalised weekly cart — ingredients matched to household needs & schedule.',
      color: 'bg-purple-50',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-300',
      icon: <ShoppingCart size={16} />,
    },
    // Adjustment branch rendered separately
    {
      id: 'checkout',
      label: '4 · Zero-Second Checkout',
      sublabel: 'One tap to confirm. Calendar-aware auto-pause when you travel.',
      color: 'bg-orange-50',
      textColor: 'text-orange-800',
      borderColor: 'border-orange-300',
      icon: <ShoppingCart size={16} />,
    },
    {
      id: 'impact',
      label: '5 · Real-World Impact',
      sublabel: 'Users see time saved, money saved & CO₂ reduced after every order.',
      bullets: [
        '⏱ Avg. 2 hrs saved per week',
        '💸 Up to 20% cost reduction',
        '🌱 Lower carbon footprint',
      ],
      color: 'bg-emerald-50',
      textColor: 'text-emerald-800',
      borderColor: 'border-emerald-300',
      icon: <Leaf size={16} />,
    },
  ];

  const businessNodes: FlowNode[] = [
    {
      id: 'market',
      label: '📊 Market Opportunity',
      sublabel: 'Online grocery market projected to reach $1.1T by 2027 (CAGR 24%).',
      color: 'bg-sky-50',
      textColor: 'text-sky-800',
      borderColor: 'border-sky-300',
    },
    {
      id: 'model',
      label: '💰 Business Model',
      bullets: [
        'SaaS subscription (€9.99/month)',
        'Retailer partnership & data licensing',
        'Premium AI preset marketplace',
      ],
      color: 'bg-teal-50',
      textColor: 'text-teal-800',
      borderColor: 'border-teal-300',
      icon: <TrendingUp size={16} />,
    },
    {
      id: 'cta',
      label: '🚀 Join Us',
      sublabel: 'Seed round open. Help us redefine the weekly grocery run.',
      color: 'bg-gradient-to-r from-red-500 to-pink-500',
      textColor: 'text-white',
      borderColor: 'border-red-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-6 px-4 overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="inline-block bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">
          Investor Pitch
        </span>
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
          Nici — Product Flow
        </h1>
        <p className="text-xs text-gray-500 mt-1">From pain point to purchase in 5 steps</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {[
          { color: 'bg-red-200', label: 'Problem' },
          { color: 'bg-blue-200', label: 'Solution' },
          { color: 'bg-purple-200', label: 'User Journey' },
          { color: 'bg-amber-200', label: 'AI Features' },
          { color: 'bg-emerald-200', label: 'Impact' },
          { color: 'bg-teal-200', label: 'Business' },
        ].map((l) => (
          <span key={l.label} className="flex items-center gap-1 text-[10px] text-gray-600">
            <span className={`inline-block w-3 h-3 rounded-full ${l.color}`} />
            {l.label}
          </span>
        ))}
      </div>

      {/* ── Section: Problem & Solution ── */}
      <div className="flex flex-col items-center">
        <FlowNode node={topNodes[0]} />
        <Arrow />
        <FlowNode node={topNodes[1]} />

        {/* ── Section: User Journey ── */}
        <div className="w-full mt-4 mb-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
              User Journey
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        </div>

        <FlowNode node={journeyNodes[0]} />
        <Arrow />
        <FlowNode node={journeyNodes[1]} />

        {/* Step 3: Adjustment branch */}
        <div className="w-full">
          <div className="flex justify-center mt-1 mb-0">
            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 rounded-full px-3 py-0.5">
              3 · Smart Adjustments
            </span>
          </div>
          <AdjustmentBranch />
        </div>

        <FlowNode node={journeyNodes[2]} />
        <Arrow />
        <FlowNode node={journeyNodes[3]} />

        {/* ── Section: Business ── */}
        <div className="w-full mt-6 mb-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
              Business Case
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        </div>

        <FlowNode node={businessNodes[0]} />
        <Arrow />
        <FlowNode node={businessNodes[1]} />
        <Arrow />
        <FlowNode node={businessNodes[2]} />
      </div>
    </div>
  );
}
