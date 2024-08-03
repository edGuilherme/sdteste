const catFactsService = require('../services/catFactsService');

const getAllCatFacts = (req, res) => {
  const catFacts = catFactsService.getCatFacts();
  res.status(200).json(catFacts);
};

const addCatFact = (req, res) => {
  const newFact = req.body;
  if (!newFact.text) {
    return res.status(400).json({ message: 'Text field is required' });
  }
  catFactsService.addCatFact(newFact);
  res.status(201).json({ message: 'Cat fact added', catFacts: catFactsService.getCatFacts() });
};

const updateCatFact = (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const updated = catFactsService.updateCatFact(id, text);
  if (!updated) {
    return res.status(404).json({ message: 'Cat fact not found' });
  }
  res.status(200).json({ message: 'Cat fact updated', catFacts: catFactsService.getCatFacts() });
};

const deleteCatFact = (req, res) => {
  const { id } = req.params;
  const deleted = catFactsService.deleteCatFact(id);
  if (!deleted) {
    return res.status(404).json({ message: 'Cat fact not found' });
  }
  res.status(200).json({ message: 'Cat fact deleted', catFacts: catFactsService.getCatFacts() });
};

const voteCatFact = (req, res) => {
  const { id } = req.params;
  const votedFact = catFactsService.voteCatFact(id);
  if (!votedFact) {
    return res.status(404).json({ message: 'Cat fact not found' });
  }
  res.status(200).json({ message: 'Vote added', fact: votedFact });
};

const getMostPopularCatFact = (req, res) => {
  const mostPopular = catFactsService.getMostPopularCatFact();
  if (!mostPopular) {
    return res.status(404).json({ message: 'No cat facts available' });
  }
  res.status(200).json(mostPopular);
};

module.exports = {
  getAllCatFacts,
  addCatFact,
  updateCatFact,
  deleteCatFact,
  voteCatFact,
  getMostPopularCatFact
};
