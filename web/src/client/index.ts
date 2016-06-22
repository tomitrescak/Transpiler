import { createApp } from 'meteor/tomi:apollo-mantra';
import layoutsModule from './modules/layouts/index';

import homeModule from './modules/home/index';

import initContext from './configs/context';
import initAccounts from './configs/accounts';
import initSemantic from './configs/semanticui';
import i18n from './configs/i18n';

import Loading from './modules/core/components/loading_view';

// modules
import coreModule from './modules/core/index';

// init i18n
i18n();

// init context
const context = initContext();

// create app and prepare context that will be injected in all other components
const app = createApp(context, Loading);

// load module
app.loadModule(coreModule);
app.loadModule(homeModule);
app.init()


// init app
initAccounts();
initSemantic();
