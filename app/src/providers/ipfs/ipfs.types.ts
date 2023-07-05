export type ContentOptions = {
  path?: string;
  name?: string;
  description?: string;
  owner?: string;
};

export type IpfsResponse = {
  path: string;
  size: number;
  uri: string;
  name?: string;
};
