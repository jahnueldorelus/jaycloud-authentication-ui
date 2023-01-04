// A user object
export interface UserData {
  _id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

// A service object
export type Service = {
  _id: string;
  name: string;
  api: string;
  portNumber: number;
  description: string;
  available: boolean;
  logo?: Blob;
};
