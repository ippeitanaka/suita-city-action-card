const fs = require('fs');

// Vercel の環境変数から SUPABASE_URL と SUPABASE_ANON_KEY を読み取り、
// public/config.js を生成します。ビルド前に実行してください。

const outPath = './public/config.js';
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const content = `// This file is generated at build time. Do not edit.
window.SUPABASE_URL = ${JSON.stringify(supabaseUrl)};
window.SUPABASE_ANON_KEY = ${JSON.stringify(supabaseKey)};
`;

// Ensure public directory exists
if (!fs.existsSync('./public')) fs.mkdirSync('./public');
fs.writeFileSync(outPath, content);
console.log('Generated', outPath);
