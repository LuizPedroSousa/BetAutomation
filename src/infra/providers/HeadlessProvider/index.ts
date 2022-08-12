import { container } from 'tsyringe';
import { PuppeteerHeadlessProvider } from './adapters/PuppeteerHeadlessProvider';
import { HeadlessProvider } from './ports/HeadlessProvider';

container.registerSingleton<HeadlessProvider>('HeadlessProvider', PuppeteerHeadlessProvider);
