import { MidwayConfig } from '@midwayjs/core';
import * as entities from '../entity';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1752830090801_1938',
  koa: {
    port: 7001,
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'sqlite',
      database: 'webbackend.db',
      synchronize: true,
      logging: true,
      entities: [...Object.values(entities)],
      },
    },
  },
} as MidwayConfig;
