import { Session, Tokenizer } from "../common.js";
import { MultimodalMetadata } from "./metadata.js";
import { Preprocessor, PreprocessorConfig } from "../image.js";
import { createSession, loadTokenizer, SessionParams } from "../browser.js";

export class BaseMultimodalModel {
  metadata: MultimodalMetadata;
  initialized: boolean;
  preprocessor?: Preprocessor;
  tokenizer?: Tokenizer;
  sessions?: Map<string, Session>;

  constructor(metadata: MultimodalMetadata) {
    if (
      SessionParams.memoryLimitMB > 0 &&
      SessionParams.memoryLimitMB < metadata.memEstimateMB
    ) {
      throw new Error(
        `The model requires ${metadata.memEstimateMB} MB of memory, but the current memory limit is 
          ${SessionParams.memoryLimitMB} MB.`
      );
    }
    this.metadata = metadata;
    this.initialized = false;
  }

  init = async (proxy = true): Promise<number> => {
    const start = new Date();
    for (const [name, path] of this.metadata.modelPaths) {
      if (!this.sessions) {
        this.sessions = new Map<string, Session>();
      }
      this.sessions.set(name, await createSession(path, proxy));
    }
    const preprocessorConfig = await PreprocessorConfig.fromFile(
      this.metadata.preprocessorPath
    );
    this.preprocessor = new Preprocessor(preprocessorConfig);
    this.tokenizer = await loadTokenizer(this.metadata.tokenizerPath);
    this.initialized = true;
    const end = new Date();
    const elapsed = (end.getTime() - start.getTime()) / 1000;
    return elapsed;
  };
}
