import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export interface Usertokens {
  _id?: string;
  email: string;
  token: string;
  createdAt: Date;
}

export const UsertokensCollection = new Mongo.Collection<Usertokens>('usertokens');

if (Meteor.isServer) {
  UsertokensCollection.rawCollection().createIndex({ token: -1 }, { unique: true });
  UsertokensCollection.rawCollection().createIndex({ email: -1 }, { unique: true });
}

