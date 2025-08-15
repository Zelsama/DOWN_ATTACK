const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('./package.json'));

// Dependências para atualizar
const updates = {
  dependencies: {
    'core-js': '^3.30.0',
    'vue': '^3.3.0'
  },
  devDependencies: {
    '@vue/cli-plugin-babel': '^5.0.8',
    '@vue/cli-plugin-eslint': '^5.0.8',
    '@vue/cli-service': '^5.0.8',
    'eslint': '^8.45.0',
    'webpack': '^5.88.0',
    'webpack-dev-server': '^4.15.0'
  }
};

// Aplicar atualizações
Object.keys(updates.dependencies).forEach(dep => {
  pkg.dependencies[dep] = updates.dependencies[dep];
});

Object.keys(updates.devDependencies).forEach(dep => {
  pkg.devDependencies[dep] = updates.devDependencies[dep];
});

fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
console.log('package.json atualizado!');