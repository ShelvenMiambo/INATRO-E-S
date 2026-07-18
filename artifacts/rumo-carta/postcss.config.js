// O Tailwind v4 é processado diretamente pelo plugin @tailwindcss/vite em
// vite.config.ts — não precisa (nem deve) passar também pelo plugin PostCSS
// clássico do tailwindcss (v3). Este ficheiro existe só para "tapar" um
// postcss.config.js solto em C:\Users\User\ que o postcss-load-config
// encontrava ao subir diretorias, e que causava dupla transformação do CSS.
export default {
  plugins: {},
};
