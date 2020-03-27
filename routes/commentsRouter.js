const commentsRouter = require('express').Router();
const {
  patchCommentByCommentID,
  deleteCommentByCommentID
} = require('../controllers/commentsController');
const { handle405s } = require('../errors');

commentsRouter
  .route('/:comment_id')
  .patch(patchCommentByCommentID)
  .delete(deleteCommentByCommentID)
  .all(handle405s);

module.exports = commentsRouter;
