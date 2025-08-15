const fs = require('fs');
const { execSync } = require('child_process');

const pkg = JSON.parse(fs.readFileSync('./package.json'));

// Atualizações necessárias
const updates = {
  dependencies: {
    'vue': '^3.3.0',
    'core-js': '^3.30.0'
  },
  devDependencies: {
    '@vue/cli-plugin-babel': '^5.0.8',
    '@vue/cli-plugin-eslint': '^5.0.8',
    '@vue/cli-service': '^5.0.8',
    'eslint': '^8.45.0',
    'webpack': '^5.88.0',
    'webpack-dev-server': '^4.15.0',
    'postcss': '^8.4.31'
  }
};

// Aplicar atualizações
Object.assign(pkg.dependencies, updates.dependencies);
Object.assign(pkg.devDependencies, updates.devDependencies);

// Adicionar resolutions se não existirem
if (!pkg.resolutions) {
  pkg.resolutions = {};
}
Object.assign(pkg.resolutions, {
  'ajv': '^6.12.3',
  'braces': '^3.0.3',
  'cross-spawn': '^6.0.6',
  'form-data': '^4.0.0',
  'tough-cookie': '^4.1.3'
});

fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));

console.log('Removendo node_modules e lock files...');
execSync('rm -rf node_modules package-lock.json');

console.log('Instalando dependências...');
execSync('npm install');

console.log('Forçando atualizações...');
execSync('npx npm-force-resolutions');
execSync('npm install');

console.log('Verificando vulnerabilidades...');
execSync('npm audit');