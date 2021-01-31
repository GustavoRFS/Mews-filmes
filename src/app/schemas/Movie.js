import mongoose from '@/database';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
  },
  average_rating: {
    type: Number,
  },
  bururu_rating: {
    type: Number,
  },
  gururu_rating: {
    type: Number,
  },
  release_date: {
    type: String,
  },
  poster_path: {
    type: String,
  },
  backdrop_path: {
    type: String,
  },
  id: {
    type: Number,
    unique: true,
    required: true,
  },
});

export default mongoose.model('Movie', movieSchema);
