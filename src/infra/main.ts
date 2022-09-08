import 'reflect-metadata';
import './containers';
import dotenv, { DotenvConfigOutput } from 'dotenv';
import { tasks } from './tasks';
import './orm/prisma';

class Main {
  constructor(public env: DotenvConfigOutput = dotenv.config()) {}

  public init() {
    tasks();
    console.log('Application started!');
  }
}

export const main = new Main();

main.init();
