const express = require('express');
const MovieService = require('../services/movies');

const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema,
} = require('../utils/schemas/movies');

const validationHandler = require('../utils/middleware/validationHandler');

const cacheResponse = require('../utils/cacheResponse');
const {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS,
} = require('../utils/time');

function moviesApi(app) {
  const router = express.Router();

  app.use('/api/movies', router);

  const moviesService = new MovieService();

  router.get('/', async function (req, res, next) {
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
  });

  router.get(
    '/:movieId',
    validationHandler({ movieId: movieIdSchema }, 'params'),
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

  router.post('/', validationHandler(createMovieSchema), async function (
    req,
    res,
    next
  ) {
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
  });

  router.put(
    '/:moviId',
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

  router.patch('/:moviId', async function (req, res, next) {
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
  });
}

module.exports = moviesApi;
