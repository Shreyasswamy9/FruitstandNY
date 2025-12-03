const path = require('path');

module.exports = {
  // Silence Next.js workspace-root warning by pointing to the inferred workspace root
  outputFileTracingRoot: path.resolve(__dirname, '..'),

  // ...existing Next.js config options (if any) ...
};
