export type MultiplyTask = {
  aggregatorPubkey: string;
};

export type WebsocketTask = {
  url: string;
  subscription: string;
  maxDataAgeSeconds: number;
  filter: string;
};

export type HttpTask = {
  url: string;
};

export type JsonParseTask = {
  path: string;
};

export type Task2 = {
  jsonParseTask: JsonParseTask;
};

export type MedianTask = {
  tasks: Task2[];
};

export type Task = {
  httpTask?: HttpTask;
  medianTask?: MedianTask;
  multiplyTask?: MultiplyTask;
  websocketTask?: WebsocketTask;
  jsonParseTask?: JsonParseTask2;
};

export type Job = {
  id: string;
  title: string;
  tasks: Task[];
};

export type JsonParseTask2 = {
  path: string;
};

export type TaskResult = {
  taskType: string;
  input: string;
  output: string;
  task: Task;
};

export type Receipt = {
  id: string;
  result: string;
  tasks: Task[];
};

export type SwitchboardFeedResponse = {
  result: string;
  results?: string[];
  receipts?: Receipt[];
  task_runner_version?: string;
};
