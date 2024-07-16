process.env.NODE_OPTIONS = '--no-deprecation';

const { execSync } = require('child_process');
execSync('react-scripts start', { stdio: 'inherit' });
