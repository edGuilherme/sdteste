const catFactsService = require('../services/catFactsService');
const js2xmlparser = require("js2xmlparser"); // transforma json em XML - usado na resposta
const protobuf = require('protobufjs');
const { v4: uuidv4 } = require('uuid');


async function convertJsonToProtobuf(jsonData) {
  // Load the .proto file
  const root = await protobuf.load('./catfacts.proto');

  // Get the message types
  const CatFact = root.lookupType('CatFact');
  const CatFactList = root.lookupType('CatFactList');

  // Convert each fact in the JSON array
  const facts = jsonData.map(fact => {
    return CatFact.create({
      status: {
        verified: fact.status.verified,
        sentCount: fact.status.sentCount
      },
      id: fact._id,
      user: fact.user,
      text: fact.text,
      v: fact.__v,
      source: fact.source,
      updatedAt: fact.updatedAt,
      type: fact.type,
      createdAt: fact.createdAt,
      deleted: fact.deleted,
      used: fact.used,
      votes: fact.votes
    });
  });
   // Create the CatFactList message
   const catFactList = CatFactList.create({ facts });

   // Encode the message
   const buffer = CatFactList.encode(catFactList).finish();
 
   return buffer;
}
const getAllCatFacts = (req, res) => {
  const catFacts = catFactsService.getCatFacts();
  switch (req.headers.accept) {
    case 'application/xml': // XML
      res.set('Content-Type', 'application/xml');
      // Envia a resposta no formato XML
      res.send(js2xmlparser.parse("catFacts", catFacts));
      break;
    case 'application/x-protobuf': // Protobuf
      res.set('Content-Type', 'application/x-protobuf');
      // Envia a resposta no formato Protobuf
      convertJsonToProtobuf(catFacts)
      .then(buffer => {
        res.send(buffer);
      })
      .catch(error => {
        console.error('Error:', error);
      });
      break;
    default: // JSON padrão
      // Envia a resposta no formato JSON
      res.status(200).json(catFacts);
      break;
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
