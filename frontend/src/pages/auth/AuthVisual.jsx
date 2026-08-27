import { motion } from 'framer-motion'
import { PushPin } from '@/components/common/PushPin'

const VIEW_W = 340
const VIEW_H = 280
const CENTER = { x: 170, y: 140 }

const NODES = [
  { id: 'python', label: 'Python', x: 92, y: 72, color: '#facc15' },
  { id: 'git', label: 'Git', x: 64, y: 30, color: '#f87171' },
  { id: 'django', label: 'Django', x: 260, y: 62, color: '#4ade80' },
  { id: 'jwt', label: 'Auth', x: 210, y: 118, color: '#38bdf8' },
  { id: 'css', label: 'CSS', x: 230, y: 170, color: '#c084fc' },
  { id: 'react', label: 'React', x: 288, y: 175, color: '#38bdf8' },
  { id: 'typescript', label: 'TS', x: 236, y: 226, color: '#3b82f6' },
  { id: 'docker', label: 'Docker', x: 152, y: 252, color: '#38bdf8' },
  { id: 'sql', label: 'SQL', x: 58, y: 216, color: '#facc15' },
  { id: 'testing', label: 'Tests', x: 36, y: 138, color: '#4ade80' },
]

const EXTRA_EDGES = [
  ['python', 'django'],
  ['django', 'jwt'],
  ['django', 'react'],
  ['react', 'typescript'],
  ['react', 'jwt'],
  ['python', 'sql'],
  ['python', 'testing'],
  ['git', 'testing'],
  ['docker', 'sql'],
  ['docker', 'typescript'],
  ['css', 'react'],
]

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]))

export function AuthVisual() {
  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Visual Header Note with Pin */}
      <div className="relative rounded-3xl bg-[#fef9c3] border border-[#fef08a] p-4 text-xs leading-relaxed shadow-xs text-[#713f12]">
        <div className="absolute -top-3 left-6">
          <PushPin color="orange" size="sm" />
        </div>
        <p className="font-bold font-display text-sm text-[#422006]">
          ✦ Connected Knowledge Graph
        </p>
        <p className="mt-1 text-[11px] opacity-80">
          All your categories, tags, code snippets, and review items organized seamlessly.
        </p>
      </div>

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full"
        role="img"
        aria-label="Your knowledge base as a connected graph of topics"
      >
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={112}
          fill="none"
          stroke="#cbd5e1"
          strokeOpacity={0.6}
          strokeWidth={1}
          strokeDasharray="4 6"
        />

        {NODES.map((n) => (
          <line
            key={`c-${n.id}`}
            x1={CENTER.x}
            y1={CENTER.y}
            x2={n.x}
            y2={n.y}
            stroke="#94a3b8"
            strokeOpacity={0.4}
            strokeWidth={1.5}
          />
        ))}

        {EXTRA_EDGES.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={byId[a].x}
            y1={byId[a].y}
            x2={byId[b].x}
            y2={byId[b].y}
            stroke="#cbd5e1"
            strokeOpacity={0.8}
            strokeWidth={1}
          />
        ))}

        {/* Center Glow */}
        <circle cx={CENTER.x} cy={CENTER.y} r={18} fill="#e0e7ff" />
        <circle cx={CENTER.x} cy={CENTER.y} r={8} fill="#4f46e5" />
        <motion.circle
          cx={CENTER.x}
          cy={CENTER.y}
          fill="none"
          stroke="#4f46e5"
          strokeOpacity={0.4}
          strokeWidth={1.5}
          initial={{ r: 10, opacity: 0.7 }}
          animate={{ r: 36, opacity: 0 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
        />
        <text
          x={CENTER.x + 14}
          y={CENTER.y + 4}
          fontSize={11}
          fontFamily="var(--font-display)"
          fontWeight={800}
          fill="#1e293b"
        >
          MINO
        </text>

        {NODES.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={4.5} fill={n.color} stroke="#ffffff" strokeWidth="1.5" />
            <text
              x={n.x + 8}
              y={n.y + 3.5}
              fontSize={10}
              fontFamily="var(--font-sans)"
              fontWeight={600}
              fill="#475569"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}