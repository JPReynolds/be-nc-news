const fsPromises = require('fs').promises;

exports.selectEndpoints = () => {
  return fsPromises.readFile('./endpoints.json', 'utf8').then(endpoints => {
    return JSON.parse(endpoints);
  });
};
