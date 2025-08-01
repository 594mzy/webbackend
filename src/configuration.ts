import { Configuration, App} from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as swagger from '@midwayjs/swagger';
import * as orm from '@midwayjs/typeorm';
import * as cors from '@koa/cors';
import * as staticFile from '@midwayjs/static-file';
// import * as path from 'path';
// import * as fs from 'fs';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import DefaultConfig from './config/config.default';
import UnitTestConfig from './config/config.unittest';

@Configuration({
  imports: [
    koa,
    orm,
    swagger,
    staticFile,
    validate,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [{
    default: DefaultConfig,
    unittest: UnitTestConfig,
  }],
})
export class MainConfiguration {
  @App('koa')
    app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
    this.app.use(cors()); // 允许所有跨域
    // console.log('✅ 应用启动成功');
    // console.log('静态资源目录（运行时）：', path.resolve(process.cwd(), 'build/public'));
    // SPA 路由兜底处理
    // this.app.use(async (ctx, next) => {
    //   await next();
    //   // 只处理 GET 请求，且不是静态资源和 API 路径
    //   if (
    //     ctx.status === 404 &&
    //     ctx.method === 'GET' &&
    //     !ctx.path.startsWith('/api') &&
    //     !ctx.path.match(/\.(js|css|png|jpg|jpeg|svg|ico|json)$/)
    //   ) {
    //     ctx.type = 'html';
    //     ctx.body = fs.createReadStream(path.join(process.cwd(), 'public', 'index.html'));
    //   }
    // });
  }
}
