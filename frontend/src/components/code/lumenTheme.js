// Syntax-highlighting theme tuned to Knowledge Base's palette.
// Warm neutrals + the single accent color; no rainbow.

export const lumenTheme = {
  plain: { color: '#d7d7de' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#6f6f7b', fontStyle: 'italic' } },
    { types: ['punctuation', 'delimiter'], style: { color: '#8b8b98' } },
    { types: ['property', 'attr-name', 'constant', 'symbol'], style: { color: '#9ccf8e' } },
    { types: ['string', 'char', 'url', 'inserted'], style: { color: '#f4c67a' } },
    { types: ['keyword', 'tag', 'selector', 'boolean', 'atrule', 'important'], style: { color: '#f07a53' } },
    { types: ['number', 'unit'], style: { color: '#e8a98c' } },
    { types: ['function', 'function-variable', 'class-name'], style: { color: '#e9e9ef' } },
    { types: ['operator', 'symbol'], style: { color: '#b9b9c4' } },
    { types: ['deleted'], style: { color: '#f2555a' } },
  ],
}