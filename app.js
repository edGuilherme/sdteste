const express = require('express');
const catFactsRoutes = require('./routes/catFactsRoutes');
const catFactsService = require('./services/catFactsService');

const app = express();
const port = 3000;

// Middleware para interpretar JSON
app.use(express.json());

app.use((req, res, next) => {
  if (req.is('application/xml') || req.is('application/xml+json')) {
    xml2js.parseString(req.body, { explicitArray: false }, (err, result) => {
      if (err) {
        return res.status(400).send('Invalid XML');
      }
      req.body = result;
      next();
    });
  } else {
    next();
  }
});

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
