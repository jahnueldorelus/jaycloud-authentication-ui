// A user object
export interface UserData {
  _id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  isAdmin: boolean;
}

// A service object
export type Service = {
  _id: string;
  name: string;
  description: string;
  uiUrl: string;
  available: boolean;
  logo?: Blob;
};
