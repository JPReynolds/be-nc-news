const usersRouter = require('express').Router();
const { getUserByUserID } = require('../controllers/usersController');

usersRouter.route('/:username').get(getUserByUserID);

module.exports = usersRouter;
