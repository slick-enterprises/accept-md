/**
 * Success banner shown after accept-md init completes.
 */

const CONTRIBUTE_URL = 'https://github.com/slick-enterprises/accept-md/blob/main/docs/CONTRIBUTING.md';

export function formatSuccessBanner(messages: string[]): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('  ╭─────────────────────────────────────────────────────────╮');
  lines.push('  │                                                         │');
  lines.push('  │    █████╗  ██████╗ ██████╗███████╗██████╗ ████████╗       │');
  lines.push('  │   ██╔══██╗██╔════╝██╔════╝██╔════╝██╔══██╗╚══██╔══╝       │');
  lines.push('  │   ███████║██║     ██║     █████╗  ██████╔╝   ██║          │');
  lines.push('  │   ██╔══██║██║     ██║     ██╔══╝  ██╔═══╝    ██║          │');
  lines.push('  │   ██║  ██║╚██████╗╚██████╗███████╗██║        ██║          │');
  lines.push('  │   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚══════╝╚═╝        ╚═╝          │');
  lines.push('  │                      · md                     ✓ Ready   │');
  lines.push('  │                                                         │');
  lines.push('  ╰─────────────────────────────────────────────────────────╯');
  lines.push('');
  lines.push('  What was done:');
  lines.push('');
  messages.forEach((m) => lines.push('    • ' + m));
  lines.push('');
  lines.push('  ─── Next steps ─────────────────────────────────────────────');
  lines.push('');
  lines.push('    1. Install dependencies (if shown above):');
  lines.push('       pnpm install   # or npm install / yarn');
  lines.push('');
  lines.push('    2. Start your app and request markdown:');
  lines.push('       curl -H "Accept: text/markdown" http://localhost:3000/');
  lines.push('');
  lines.push('    3. Optional: edit accept-md.config.js for include/exclude');
  lines.push('       and cleanSelectors (e.g. nav, footer).');
  lines.push('');
  lines.push('  ────────────────────────────────────────────────────────────');
  lines.push('');
  lines.push('  Contribute: ' + CONTRIBUTE_URL);
  lines.push('');

  return lines.join('\n');
}
