const express = require('express');
const passport = require('passport');
const MovieService = require('../services/movies');

const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema,
} = require('../utils/schemas/movies');
// jwt strategy
require('../utils/auth/strategies/jwt');

const validationHandler = require('../utils/middleware/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

const cacheResponse = require('../utils/cacheResponse');
const {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS,
} = require('../utils/time');

function moviesApi(app) {
  const router = express.Router();

  app.use('/api/movies', router);

  const moviesService = new MovieService();

  router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:movies']),
    async function (req, res, next) {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS);

      const { tags } = req.query;
      try {
        const movies = await moviesService.getMovies({ tags });

        res.status(200).json({
          data: movies,
          message: 'movies listed',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.get(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    scopesValidationHandler(['read:movies']),
    async function (req, res, next) {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
      const { movieId } = req.params;

      try {
        const movie = await moviesService.getMovie({ movieId });
        res.status(200).json({
          data: movie,
          message: 'Movie retrieved',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:movies']),
    validationHandler(createMovieSchema),
    async function (req, res, next) {
      const { body: movie } = req;
      try {
        const createdMovieId = await moviesService.createMovie({
          movie,
        });

        res.status(201).json({
          data: createdMovieId,
          message: 'movie created',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.put(
    '/:moviId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    validationHandler(updateMovieSchema),
    async function (req, res, next) {
      const { body: movie } = req;

      const { movieId } = req.params;

      try {
        const updtatedMovieId = await moviesService.updateMovie({
          movieId,
          movie,
        });
        res.status(200).json({
          data: updtatedMovieId,
          message: 'Movie updtated',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.delete(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['deleted:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    async function (req, res, next) {
      const { movieId } = req.params;
      try {
        const deletedMovieId = await moviesService.deleteMovie({ movieId });
        res.status(200).json({
          data: deletedMovieId,
          message: 'Movie deleted ok',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.patch(
    '/:moviId',
    passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
      const { body: movie } = req;

      const { movieId } = req.params;

      try {
        const patchMovieId = await moviesService.patchMovie({ movieId, movie });
        res.status(200).json({
          data: patchMovieId,
          message: 'Movie patch',
        });
      } catch (error) {
        next(error);
      }
    }
  );
}

module.exports = moviesApi;
