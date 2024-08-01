const express = require('express');
const catFactsRoutes = require('./routes/catFactsRoutes');
const catFactsService = require('./services/catFactsService');

const app = express();
const port = 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Atualizar cat facts ao iniciar o servidor
catFactsService.updateCatFacts().then(() => {
  // Usar rotas após a atualização inicial
  app.use('/catfacts', catFactsRoutes);

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Error initializing server:', error);
});
