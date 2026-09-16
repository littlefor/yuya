import { dedupe } from "./pack.js";
import { lifeWords } from "./lexicon-life.js";
import { examWords } from "./lexicon-exam.js";
import { plusWords } from "./lexicon-plus.js";

export const words = dedupe([...lifeWords, ...examWords, ...plusWords]);
