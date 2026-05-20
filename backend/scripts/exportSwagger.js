const fs = require('fs');
const path = require('path');

// Carrega a especificação gerada pelo swagger-jsdoc
const swaggerSpec = require('../docs/swagger.js');

const outPath = path.join(__dirname, '..', '..', 'docs', 'swagger-ui', 'swagger.json');

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(swaggerSpec, null, 2), 'utf8');
console.log('Swagger JSON exportado para:', outPath);
