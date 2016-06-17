import { createApp } from 'mantra-core';
import layoutsModule from './modules/layouts/index';

import homeModule from './modules/home/index';

import initContext from './configs/context';
import initAccounts from './configs/accounts';
import initSemantic from './configs/semanticui';
import i18n from './configs/i18n';

// modules
import coreModule from './modules/core/index';
import markingModule from './modules/marking/index';

// init context
const context = initContext();

// create app and prepare context that will be injected in all other components
const app = createApp(context);

// load module
app.loadModule(coreModule);
app.loadModule(markingModule);
app.loadModule(homeModule);
app.init()


// init app
initAccounts();
initSemantic();
i18n();
