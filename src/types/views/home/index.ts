export type Service = {
  _id: string;
  name: string;
  description: string;
  logo?: Blob;
};

export type HomeLoaderData = {
  servicesList: Service[] | null;
};
