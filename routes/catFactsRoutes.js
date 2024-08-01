const express = require('express');
const router = express.Router();
const catFactsController = require('../controllers/catFactsController');

// Rota para obter todos os cat facts
router.get('/', catFactsController.getAllCatFacts);

// Rota para adicionar um cat fact
router.post('/', catFactsController.addCatFact);

// Rota para atualizar um cat fact
router.put('/:id', catFactsController.updateCatFact);

// Rota para deletar um cat fact
router.delete('/:id', catFactsController.deleteCatFact);

// Rota para adicionar um voto a um cat fact
router.post('/:id/vote', catFactsController.voteCatFact);

// Rota para obter o cat fact mais popular
router.get('/popular', catFactsController.getMostPopularCatFact);

module.exports = router;
