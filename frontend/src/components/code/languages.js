// Map Knowledge Base's language codes to prism languages. Also accepts prism's own
// names (used when code arrives inside markdown, e.g. ```python).
const languageMap = {
  PYTHON: 'python',
  JAVASCRIPT: 'javascript',
  TYPESCRIPT: 'typescript',
  HTML: 'markup',
  CSS: 'css',
  SQL: 'sql',
  BASH: 'bash',
  JSON: 'json',
  OTHER: 'text',
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  py: 'python',
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  html: 'markup',
  css: 'css',
  sql: 'sql',
  bash: 'bash',
  shell: 'bash',
  sh: 'bash',
  json: 'json',
  text: 'text',
  plaintext: 'text',
}

export const languageLabels = {
  PYTHON: 'Python',
  JAVASCRIPT: 'JavaScript',
  TYPESCRIPT: 'TypeScript',
  HTML: 'HTML',
  CSS: 'CSS',
  SQL: 'SQL',
  BASH: 'Bash',
  JSON: 'JSON',
  OTHER: 'Text',
  markup: 'HTML',
  jsx: 'JSX',
  tsx: 'TSX',
}

export function codeLanguage(language) {
  return languageMap[language] || 'text'
}