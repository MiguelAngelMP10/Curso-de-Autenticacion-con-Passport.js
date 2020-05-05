const joi = require('@hapi/joi');

const { movieIdSchema } = require('./movies');
const { userIdSchema } = require('./users');

const userMovieIdSchema = joi.string().regex(/^[0-9A-Fa-f]{24}/);

const createUserMovieSchema = {
  userIdSchema,
  movieIdSchema,
};

module.exports = {
  userMovieIdSchema,
  createUserMovieSchema,
};
