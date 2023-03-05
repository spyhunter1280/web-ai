import { TextFeatureExtractionModel } from "./featureExtractionModel";
import { ITextModel } from "./interfaces";
import { models } from "./models";
import { TextModelType } from "./modeType";
import { Seq2SeqModel } from "./seq2seqModel";

export interface InitTextModelResult {
  model: ITextModel;
  elapsed: number;
}

export class TextModel {
  static create = async (id: string, cacheSizeMB = 500, proxy = true): Promise<InitTextModelResult> => {
    for (const modelMetadata of models) {
      if (modelMetadata.id === id) {
        switch (modelMetadata.type) {
          case TextModelType.FeatureExtraction: {
            const model = new TextFeatureExtractionModel(modelMetadata);
            const elapsed = await model.init(cacheSizeMB, proxy);
            return {
              model: model,
              elapsed: elapsed,
            };
          }
          case TextModelType.Seq2Seq: {
            const model = new Seq2SeqModel(modelMetadata);
            const elapsed = await model.init(cacheSizeMB, proxy);
            return {
              model: model,
              elapsed: elapsed,
            };
          }
        }
      }
    }
    throw Error("there is no text model with specified id");
  };
}
