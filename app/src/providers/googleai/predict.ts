import { helpers } from "@google-cloud/aiplatform";

import predictionServiceClient from "./prediction-service-client";
import { Prompt } from "./googleai.types";

const predict = async (prompt: Prompt, endpoint: string) => {
  const instanceValue = helpers.toValue(prompt);

  const instances = [instanceValue] as protobuf.common.IValue[];

  const parameter = {
    temperature: 1,
    maxOutputTokens: 1000,
    topP: 0.95,
    topK: 40,
  };

  const parameters = helpers.toValue(parameter);

  return predictionServiceClient.predict({
    endpoint,
    instances,
    parameters,
  });
};

export default predict;
