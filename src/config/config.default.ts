import { MidwayConfig } from '@midwayjs/core';
import * as entities from '../entity';
// import * as path from 'path';
// console.log('静态资源目录：', path.resolve(__dirname, '../build/public'));

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1752830090801_1938',
  koa: {
    port: 7001,
  },
  staticFile: {
    dirs:
    {
      default: {
        prefix: '/', // 访问前缀
        dir: 'public', // 静态资源目录
      },
      another: {
        prefix: '/assets',
        dir: 'public/assets',
      },
    },
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
