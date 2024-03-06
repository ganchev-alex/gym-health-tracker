import mongoose = require("mongoose");

import { Schema } from "mongoose";

export interface IExploration {
  title: string;
  category: string;
  duration: number;
  image: string;
  keywords: string[];
  target: string[];
  level: string[];
  sex: string;
  content: {
    type: string;
    title: string;
    description: string;
    body: string;
    routines?: mongoose.Types.ObjectId[] | undefined;
    source?: string;
  };
}

const explorationSchema = new Schema<IExploration>({
  title: String,
  category: String,
  duration: Number,
  image: String,
  keywords: [String],
  target: [String],
  level: [String],
  sex: String,
  content: {
    type: { type: String },
    title: String,
    description: String,
    body: String,
    routines: {
      type: [
        {
          type: Schema.ObjectId,
          ref: "SharedRoutine",
          required: true,
          default: undefined,
        },
      ],
    },
    source: String,
  },
});

const Exploration = mongoose.model<IExploration>(
  "Exploration",
  explorationSchema,
  "explorations"
);

export default Exploration;
