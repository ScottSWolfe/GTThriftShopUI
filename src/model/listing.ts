import {User} from './user';

export class Listing {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isOpen: boolean;
  user: User;
  userRating: number;
}
