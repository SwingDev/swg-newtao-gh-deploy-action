import { sleepFor } from '@utils/promises';
import { PollNoLonger } from './errors';

export class Poller {
  public promise: Promise<void>;

  private readonly pollingStart: number;

  constructor(
    private readonly timeout: number,
    private readonly resolution: number,
    private readonly pollFn: (() => Promise<void>),
  ) {
    this.pollFn = pollFn;
    this.resolution = resolution;
    this.timeout = timeout;

    this.pollingStart = Date.now();

    this.promise = this.run();
  }

  private async run(): Promise<void> {
    while (this.shouldStillPoll()) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await this.pollFn();
      } catch (e) {
        if (e instanceof PollNoLonger) {
          break;
        }
      }

      // eslint-disable-next-line no-await-in-loop
      await sleepFor(this.resolution);
    }
  }

  private shouldStillPoll() {
    return Date.now() - this.pollingStart < this.timeout;
  }
}
