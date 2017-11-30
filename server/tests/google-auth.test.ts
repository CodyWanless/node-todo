import * as expect from 'expect';
import * as request from 'supertest';
import { ObjectID } from 'mongodb';

import app from './../server';
import { Todo } from './../models/todo';
import { User, IUser } from './../models/user';
import { todos, populateTodos, users, populateUsers } from './seed/seed';

describe('/auth/google', () => {
    // it ('should create a new user', (done) => {

    // });
});