import dva from 'dva';
import 'moment/locale/zh-cn';
import './polyfill';
// import { browserHistory } from 'dva/router';
import './index.less';
import createLoading from 'dva-loading';
// 1. Initialize
const app = dva({
  // history: browserHistory,
});

// 2. Plugins
// app.use({});
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');

