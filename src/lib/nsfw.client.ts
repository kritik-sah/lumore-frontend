"use client";
const NSFW_THRESHOLD = 0.6;
const NSFW_CLASSES = new Set(["Porn", "Hentai", "Sexy"]);
const NSFW_MODEL_URL = "/nsfw_model/model.json";
const NSFW_MODEL_SIZE = 299;
const NSFW_LOAD_OPTIONS = { size: NSFW_MODEL_SIZE };
const NSFW_INDEXEDDB_KEY = "indexeddb://lumore-nsfw-model-v2";

type NsfwModel = {
  classify: (
    input: HTMLImageElement | HTMLCanvasElement | ImageData | ImageBitmap,
  ) => Promise<Array<{ className: string; probability: number }>>;
};

let modelPromise: Promise<NsfwModel> | null = null;
let cacheWriteAttempted = false;

const persistModelToIndexedDb = async (model: NsfwModel) => {
  if (cacheWriteAttempted) return;
  cacheWriteAttempted = true;

  try {
    const internalModel = (model as any)?.model;
    if (typeof internalModel?.save === "function") {
      await internalModel.save(NSFW_INDEXEDDB_KEY);
    }
  } catch {
    // Best-effort cache write only; fallback path is direct local model loading.
  }
};

const loadModel = async (): Promise<NsfwModel> => {
  if (!modelPromise) {
    modelPromise = (async () => {
      const tf = await import("@tensorflow/tfjs");
      await tf.ready();

      const nsfwModule = await import("nsfwjs");
      const nsfwLib = (nsfwModule as { default?: any }).default ?? nsfwModule;

      try {
        return (await nsfwLib.load(
          NSFW_INDEXEDDB_KEY,
          NSFW_LOAD_OPTIONS,
        )) as NsfwModel;
      } catch {
        const freshModel = (await nsfwLib.load(
          NSFW_MODEL_URL,
          NSFW_LOAD_OPTIONS,
        )) as NsfwModel;
        await persistModelToIndexedDb(freshModel);
        return freshModel;
      }
    })();
  }

  return modelPromise;
};

const fileToImageBitmap = async (file: File): Promise<ImageBitmap> => {
  try {
    return await createImageBitmap(file);
  } catch {
    throw new Error("Unable to process selected image");
  }
};

export const assertImageIsSafe = async (
  file: File,
  threshold = NSFW_THRESHOLD,
) => {
  if (!file || !file.type.startsWith("image/")) return;

  const [model, imageBitmap] = await Promise.all([
    loadModel(),
    fileToImageBitmap(file),
  ]);

  try {
    const predictions = await model.classify(imageBitmap);
    const hasNsfw = predictions.some(
      (p) => NSFW_CLASSES.has(p.className) && p.probability >= threshold,
    );

    if (hasNsfw) {
      throw new Error(
        "NSFW content detected. Please choose a different image.",
      );
    }
  } finally {
    imageBitmap.close();
  }
};

export const preloadNSFWModel = async () => {
  await loadModel();
};
