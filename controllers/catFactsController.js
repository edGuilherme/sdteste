const catFactsService = require('../services/catFactsService');
const js2xmlparser = require("js2xmlparser"); // transforma json em XML - usado na resposta
const { v4: uuidv4 } = require('uuid');

let currentId = 1;

const getAllCatFacts = (req, res) => {
  const catFacts = catFactsService.getCatFacts();
  if (req.headers.accept === 'application/xml') {
    res.set('Content-Type', 'application/xml');
    res.send(js2xmlparser.parse("catFacts", catFacts));
  } else {
    res.status(200).json(catFacts);
  }
};

const addCatFact = (req, res) => {
  const newFact = req.body;
  
  // Validação básica do campo 'text'
  if (!newFact.text) {
    const errorResponse = { message: 'Text field is required' };
    if (req.headers.accept === 'application/xml') {
      res.set('Content-Type', 'application/xml');
      return res.status(400).send(js2xmlparser.parse("error", errorResponse));
    }
    return res.status(400).json(errorResponse);
  }

  // Adiciona um novo ID, garantindo que é um hexa
  newFact._id = uuidv4().replace(/-/g, '').substring(0, 24);
  
  // Adiciona o novo cat fact usando o serviço
  catFactsService.addCatFact(newFact);
  
  // Prepara a resposta
  const response = { message: 'Cat fact added', catFacts: catFactsService.getCatFacts() };
  
  // Envia a resposta no formato adequado
  if (req.headers.accept === 'application/xml') {
    res.set('Content-Type', 'application/xml');
    return res.status(201).send(js2xmlparser.parse("response", response));
  }
  
  res.status(201).json(response);
};

const updateCatFact = (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const updated = catFactsService.updateCatFact(id, text);
  if (!updated) {
    if (req.headers.accept === 'application/xml') {
      res.set('Content-Type', 'application/xml');
      return res.status(404).send(js2xmlparser.parse("error", { message: 'Cat fact not found' }));
    }
    return res.status(404).json({ message: 'Cat fact not found' });
  }
  const response = { message: 'Cat fact updated', catFacts: catFactsService.getCatFacts() };
  if (req.headers.accept === 'application/xml') {
    res.set('Content-Type', 'application/xml');
    res.status(200).send(js2xmlparser.parse("response", response));
  } else {
    res.status(200).json(response);
  }
};

const deleteCatFact = (req, res) => {
  const { id } = req.params;
  const deleted = catFactsService.deleteCatFact(id);
  if (!deleted) {
    if (req.headers.accept === 'application/xml') {
      res.set('Content-Type', 'application/xml');
      return res.status(404).send(js2xmlparser.parse("error", { message: 'Cat fact not found' }));
    }
    return res.status(404).json({ message: 'Cat fact not found' });
  }
  const response = { message: 'Cat fact deleted', catFacts: catFactsService.getCatFacts() };
  if (req.headers.accept === 'application/xml') {
    res.set('Content-Type', 'application/xml');
    res.status(200).send(js2xmlparser.parse("response", response));
  } else {
    res.status(200).json(response);
  }
};

const voteCatFact = (req, res) => {
  const { id } = req.params;
  const votedFact = catFactsService.voteCatFact(id);
  if (!votedFact) {
    if (req.headers.accept === 'application/xml') {
      res.set('Content-Type', 'application/xml');
      return res.status(404).send(js2xmlparser.parse("error", { message: 'Cat fact not found' }));
    }
    return res.status(404).json({ message: 'Cat fact not found' });
  }
  const response = { message: 'Vote added', fact: votedFact };
  if (req.headers.accept === 'application/xml') {
    res.set('Content-Type', 'application/xml');
    res.status(200).send(js2xmlparser.parse("response", response));
  } else {
    res.status(200).json(response);
  }
};

const getMostPopularCatFact = (req, res) => {
  const mostPopular = catFactsService.getMostPopularCatFact();
  if (!mostPopular) {
    if (req.headers.accept === 'application/xml') {
      res.set('Content-Type', 'application/xml');
      return res.status(404).send(js2xmlparser.parse("error", { message: 'No cat facts available' }));
    }
    return res.status(404).json({ message: 'No cat facts available' });
  }
  if (req.headers.accept === 'application/xml') {
    res.set('Content-Type', 'application/xml');
    res.status(200).send(js2xmlparser.parse("mostPopularCatFact", mostPopular));
  } else {
    res.status(200).json(mostPopular);
  }
};

module.exports = {
  getAllCatFacts,
  addCatFact,
  updateCatFact,
  deleteCatFact,
  voteCatFact,
  getMostPopularCatFact
};
