import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { GlobalService } from './globalservice';

@Injectable()
export class GracfulShutdown implements OnApplicationShutdown {
  onApplicationShutdown(signal?: string) {
    if (signal === 'SIGINT') {
      GlobalService.isDisableKeepAlive = true;
      console.log('server closed');
    }
  }
}
