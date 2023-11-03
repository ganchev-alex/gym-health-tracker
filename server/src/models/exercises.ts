import mongoose = require("mongoose");

const Schema = mongoose.Schema;

interface IExercise {
  name: string;
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  image: string;
}

const exerciseSchema = new Schema<IExercise>({
  name: {
    type: String,
    required: true,
  },
  equipment: {
    type: String,
    required: true,
  },
  primaryMuscles: {
    type: [String],
    required: true,
  },
  secondaryMuscles: {
    type: [String],
    required: true,
  },
  instructions: {
    type: [String],
    required: true,
  },
});

const Exercise = mongoose.model<IExercise>(
  "Exercise",
  exerciseSchema,
  "exercises"
);

export default Exercise;
