import { motion } from 'framer-motion'

const VIEW_W = 340
const VIEW_H = 280

const CENTER = { x: 162, y: 148 }

const NODES = [
  { id: 'python', label: 'Python', x: 92, y: 72 },
  { id: 'git', label: 'Git', x: 64, y: 28 },
  { id: 'django', label: 'Django', x: 258, y: 62 },
  { id: 'jwt', label: 'JWT', x: 205, y: 118 },
  { id: 'css', label: 'CSS', x: 222, y: 168 },
  { id: 'react', label: 'React', x: 288, y: 172 },
  { id: 'typescript', label: 'TS', x: 236, y: 224 },
  { id: 'docker', label: 'Docker', x: 152, y: 252 },
  { id: 'sql', label: 'SQL', x: 58, y: 216 },
  { id: 'testing', label: 'Testing', x: 36, y: 138 },
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

function ConsoleStatus() {
  return (
    <div className="mono w-full rounded-2xl border border-slate-200/90 bg-white/80 backdrop-blur-md px-4 py-3 text-[12px] leading-6 shadow-sm">
      <p className="text-slate-500 font-medium">
        $ <span className="font-bold text-slate-800">kb</span> init --knowledge
      </p>
      <p className="text-slate-700 font-semibold">
        <span className="mr-2 text-emerald-500 font-bold">✓</span>
        <span className="text-slate-600">notes indexed</span>
      </p>
      <p className="text-slate-700 font-semibold">
        <span className="mr-2 text-emerald-500 font-bold">✓</span>
        <span className="text-slate-600">categories &amp; tags linked</span>
      </p>
      <p className="text-slate-500">
        ${' '}
        <motion.span
          className="inline-block text-cyan-600 font-bold"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, repeatType: 'reverse' }}
        >
          _
        </motion.span>
      </p>
    </div>
  )
}

export function AuthVisual() {
  return (
    <div className="flex flex-col gap-6">
      <ConsoleStatus />

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
          strokeDasharray="3 6"
        />

        {NODES.map((n) => (
          <line
            key={`c-${n.id}`}
            x1={CENTER.x}
            y1={CENTER.y}
            x2={n.x}
            y2={n.y}
            stroke="#06b6d4"
            strokeOpacity={0.35}
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

        {/* centre glow */}
        <circle cx={CENTER.x} cy={CENTER.y} r={16} fill="rgba(6, 182, 212, 0.15)" />
        <circle cx={CENTER.x} cy={CENTER.y} r={6} fill="#06b6d4" />
        <motion.circle
          cx={CENTER.x}
          cy={CENTER.y}
          fill="none"
          stroke="#06b6d4"
          strokeOpacity={0.5}
          strokeWidth={1.5}
          initial={{ r: 9, opacity: 0.6 }}
          animate={{ r: 36, opacity: 0 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 1 }}
        />
        <text
          x={CENTER.x + 14}
          y={CENTER.y + 4}
          fontSize={11}
          fontFamily="var(--font-mono)"
          fontWeight={700}
          fill="#0891b2"
        >
          kb
        </text>

        {NODES.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={3.5} fill="#8b5cf6" />
            <text
              x={n.x + 7}
              y={n.y + 3}
              fontSize={9.5}
              fontFamily="var(--font-mono)"
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