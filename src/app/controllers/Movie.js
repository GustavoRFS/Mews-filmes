import { Router } from 'express';
import movieSchema from '../schemas/Movie';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import { isValidObjectId } from 'mongoose';

const router = new Router();

router.post('/', AuthMiddleware, (req, res) => {
  const {
    title,
    overview,
    release_date,
    poster_path,
    backdrop_path,
    id,
  } = req.body;

  if (!title) {
    return res.status(400).send({ error: 'Title must not be empty' });
  }

  movieSchema
    .create({
      title,
      overview,
      release_date,
      poster_path,
      backdrop_path,
      id,
    })
    .then((movie) => {
      return res.send(movie);
    })
    .catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).send({ error: `Filme já adicionado` });
      }
      return res.status(500).send({ error: 'Erro interno do servidor' });
    });
});

router.get('/', AuthMiddleware, (req, res) => {
  movieSchema
    .find()
    .sort({ average_rating: -1 })
    .exec()
    .then((movies) => {
      return res.send(movies);
    })
    .catch(() => {
      return res.status(500).send({ error: 'Erro interno do servidor' });
    });
});

router.delete('/', AuthMiddleware, (req, res) => {
  const { _id } = req.query;

  if (!_id || !isValidObjectId(_id)) {
    return res.status(400).send({ error: 'No valid ID provided' });
  }

  movieSchema
    .findByIdAndRemove(_id)
    .then((movie) => {
      if (movie) {
        return res.send(movie);
      } else {
        return res.status(404).send({ error: 'Movie not found' });
      }
    })
    .catch(() => {
      return res.status(500).send({ error: 'Erro interno do servidor' });
    });
});

router.get('/bururu', AuthMiddleware, (req, res) => {
  movieSchema
    .find()
    .then((movies) => {
      const arrayFiltered = movies.filter((movie) => {
        return (
          movie.bururu_rating !== undefined && movie.bururu_rating !== null
        );
      });
      const arraySort = arrayFiltered.sort((a, b) => {
        return b.bururu_rating - a.bururu_rating;
      });
      return res.send(
        arraySort.filter((movie, index) => {
          return index < 10;
        }),
      );
    })
    .catch(() => {
      return res.status(500).send({ error: 'Erro interno do servidor' });
    });
});

router.get('/gururu', AuthMiddleware, (req, res) => {
  movieSchema
    .find()
    .then((movies) => {
      const arrayFiltered = movies.filter((movie) => {
        return (
          movie.gururu_rating !== undefined && movie.gururu_rating !== null
        );
      });
      const arraySort = arrayFiltered.sort((a, b) => {
        return b.gururu_rating - a.gururu_rating;
      });
      return res.send(
        arraySort.filter((movie, index) => {
          return index < 10;
        }),
      );
    })
    .catch(() => {
      return res.status(500).send({ error: 'Erro interno do servidor' });
    });
});

router.get('/average', AuthMiddleware, (req, res) => {
  movieSchema
    .find()
    .then((movies) => {
      const arrayFiltered = movies.filter((movie) => {
        return (
          movie.average_rating !== undefined && movie.average_rating !== null
        );
      });
      const arraySort = arrayFiltered.sort((a, b) => {
        return b.average_rating - a.average_rating;
      });
      const top10 = arraySort.filter((movie, index) => {
        return index < 10;
      });
      return res.send(top10);
    })
    .catch(() => {
      return res.status(500).send({ error: 'Erro interno do servidor' });
    });
});

router.get('/not_rated', AuthMiddleware, async (req, res) => {
  const movies = await movieSchema
    .find()
    .lean()
    .exec()
    .catch(() => {
      return res.status(500).send({ error: 'Erro interno do servidor' });
    });

  return res.send(
    movies.filter((movie) => {
      if (req.name === 'Gururu') {
        return (
          movie.gururu_rating === undefined || movie.gururu_rating === null
        );
      } else {
        return (
          movie.bururu_rating === undefined || movie.bururu_rating === null
        );
      }
    }),
  );
});

router.put('/rate', AuthMiddleware, (req, res) => {
  const { _id, ratingValue } = req.body;

  if (!_id || !isValidObjectId(_id)) {
    return res.status(400).send({ error: 'No valid Movie ID provided' });
  }

  movieSchema
    .findById(_id)
    .then((movie) => {
      const ratings = [];
      if (req.name === 'Gururu') {
        movie.gururu_rating = ratingValue;
      } else if (req.name === 'Bururu') {
        movie.bururu_rating = ratingValue;
      }

      if (movie.gururu_rating !== undefined) {
        ratings.push(movie.gururu_rating);
      }
      if (movie.bururu_rating !== undefined) {
        ratings.push(movie.bururu_rating);
      }
      var average = 0;
      ratings.forEach((rating) => {
        average += rating;
      });
      average /= ratings.length;

      movie.average_rating = average;

      movie.save();

      console.log(movie);

      return res.send(movie);
    })
    .catch(() => {
      return res.status(500).send({ error: 'Erro interno do servidor' });
    });
});

export default router;
