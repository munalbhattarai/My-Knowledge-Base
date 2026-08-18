import { motion } from 'framer-motion'

const VIEW_W = 340
const VIEW_H = 280

// A constellation of the topics a developer collects. The centre node is the
// knowledge base itself; everything else links back to it.
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
    <div className="mono w-full rounded-lg border border-line bg-surface px-4 py-3 text-[12px] leading-6">
      <p className="text-fg-subtle">
        $ <span className="text-fg-secondary">lumen</span> init --knowledge
      </p>
      <p className="text-fg-secondary">
        <span className="mr-2 text-ok">✓</span>
        <span className="text-fg-subtle">notes indexed</span>
      </p>
      <p className="text-fg-secondary">
        <span className="mr-2 text-ok">✓</span>
        <span className="text-fg-subtle">categories &amp; tags linked</span>
      </p>
      <p className="text-fg-subtle">
        ${' '}
        <motion.span
          className="inline-block text-accent"
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
          stroke="var(--color-line-strong)"
          strokeOpacity={0.55}
          strokeWidth={1}
          strokeDasharray="2 7"
        />

        {NODES.map((n) => (
          <line
            key={`c-${n.id}`}
            x1={CENTER.x}
            y1={CENTER.y}
            x2={n.x}
            y2={n.y}
            stroke="var(--color-accent)"
            strokeOpacity={0.16}
            strokeWidth={1}
          />
        ))}

        {EXTRA_EDGES.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={byId[a].x}
            y1={byId[a].y}
            x2={byId[b].x}
            y2={byId[b].y}
            stroke="var(--color-line-strong)"
            strokeOpacity={0.6}
            strokeWidth={1}
          />
        ))}

        {/* centre glow */}
        <circle cx={CENTER.x} cy={CENTER.y} r={14} fill="var(--color-accent-soft)" />
        <circle cx={CENTER.x} cy={CENTER.y} r={5.5} fill="var(--color-accent)" />
        <motion.circle
          cx={CENTER.x}
          cy={CENTER.y}
          fill="none"
          stroke="var(--color-accent)"
          strokeOpacity={0.45}
          strokeWidth={1.5}
          initial={{ r: 9, opacity: 0.6 }}
          animate={{ r: 34, opacity: 0 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 1 }}
        />
        <text
          x={CENTER.x + 12}
          y={CENTER.y + 4}
          fontSize={10}
          fontFamily="var(--font-mono)"
          fontWeight={600}
          fill="var(--color-accent)"
        >
          lumen
        </text>

        {NODES.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={3} fill="var(--color-fg-secondary)" />
            <text
              x={n.x + 7}
              y={n.y + 3}
              fontSize={9}
              fontFamily="var(--font-mono)"
              fill="var(--color-fg-faint)"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}