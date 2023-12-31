import {
  TextModel,
  FeatureExtractionModel,
} from "@visheratin/web-ai-node/text";
import { SessionParams } from "@visheratin/web-ai-node";

const test = async () => {
  SessionParams.wasmRoot =
    "/home/alexvish/src/in-browser-ai/examples/node/dist/wasm";
  SessionParams.executionProviders = ["cpu"];
  const modelResult = await TextModel.create("mini-lm-v2-quant", false);
  const model = modelResult.model as FeatureExtractionModel;
  const output = await model.process([
    "Embeddings are the AI-native way to represent any kind of data, making them the perfect fit for working with all kinds of AI-powered tools and algorithms. They can represent text, images, and soon audio and video. There are many options for creating embeddings, whether locally using an installed library, or by calling an API.",
    "Chroma provides lightweight wrappers around popular embedding providers, making it easy to use them in your apps. You can set an embedding function when you create a Chroma collection, which will be used automatically, or you can call them directly yourself.",
  ]);
  console.log(
    `${output.tokensNum} tokens were processed in ${output.elapsed} seconds.`
  );
  console.log(output.result);
};

test();
