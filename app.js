const express = require('express');
const catFactsRoutes = require('./routes/catFactsRoutes');
const catFactsService = require('./services/catFactsService');


const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

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
