const { selectEndpoints } = require('../models/apiModel');

exports.getEndpoints = (req, res, next) => {
  selectEndpoints().then(endpoints => {
    res.status(200).send({ endpoints });
  });
};
