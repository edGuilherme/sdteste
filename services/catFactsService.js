const axios = require('axios');

// Array local para armazenar os cat facts
let catfacts = [];

// Função para buscar e atualizar os cat facts
async function updateCatFacts() {
  try {
    const response = await axios.get('https://cat-fact.herokuapp.com/facts');
    if (Array.isArray(response.data)) {
      catfacts = response.data.map(fact => ({
        ...fact,
        votes: 0 // Inicializa o número de votos
      }));
    } else {
      console.error('Response data is not an array:', response.data);
    }
  } catch (error) {
    console.error('Error updating cat facts:', error.response ? error.response.data : error.message);
  }
}

function getCatFacts() {
  return catfacts;
}

function addCatFact(newFact) {
  if (!newFact || !newFact._id || !newFact.text) {
    console.error('Invalid cat fact:', newFact);
    return false;
  }
  newFact.votes = 0; // Inicializa o número de votos para o novo cat fact
  catfacts.push(newFact);
  return true;
}

function updateCatFact(id, text) {
  const index = catfacts.findIndex(fact => fact._id === id);
  if (index === -1) return false;
  if (text) {
    catfacts[index].text = text;
  }
  return true;
}

function deleteCatFact(id) {
  const index = catfacts.findIndex(fact => fact._id === id);
  if (index === -1) return false;
  catfacts.splice(index, 1);
  return true;
}

function voteCatFact(id) {
  const fact = catfacts.find(fact => fact._id === id);
  if (!fact) return null; // Retorna null se o fact não for encontrado
  fact.votes += 1;
  return fact; // Retorna o fact atualizado
}

function getCatFact(id) {
  return catfacts.find(fact => fact._id === id);
}

function getMostPopularCatFact() {
  if (catfacts.length === 0) return null;
  return catfacts.reduce((max, fact) => (fact.votes > max.votes ? fact : max), catfacts[0]);
}

module.exports = {
  updateCatFacts,
  getCatFacts,
  addCatFact,
  updateCatFact,
  deleteCatFact,
  voteCatFact,
  getCatFact,
  getMostPopularCatFact
};
