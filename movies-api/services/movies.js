const MongoLib = require('../lib/mongo');
class MovieService {
  constructor() {
    this.colletion = 'movies';
    this.mongoDB = new MongoLib();
  }

  async getMovies({ tags }) {
    const query = tags && { tags: { $in: tags } };
    const movies = await this.mongoDB.getAll(this.colletion, query);
    return movies || [];
  }

  async getMovie({ movieId }) {
    const movie = await this.mongoDB.get(this.colletion, movieId);
    return movie || {};
  }

  async createMovie({ movie }) {
    const createMovieID = await this.mongoDB.create(this.colletion, movie);
    return createMovieID;
  }

  async updateMovie({ movieId, movie } = {}) {
    const updateMovieID = await this.mongoDB.update(
      this.colletion,
      movieId,
      movie
    );
    return updateMovieID;
  }

  async patchMovie({ movieId, movie } = {}) {
    const updateMovieID = await this.mongoDB.update(
      this.colletion,
      movieId,
      movie
    );
    return updateMovieID;
  }

  async deleteMovie({ movieId }) {
    const deleteMovieID = await this.mongoDB.delete(this.colletion, movieId);
    return deleteMovieID;
  }
}

module.exports = MovieService;
