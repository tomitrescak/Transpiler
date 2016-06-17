import { useDeps } from 'mantra-core';
import Layout from '../components/main_layout';

const depsToPropsMapper = (context: IContext) => ({
  context: context,
  store: context.Store,
});

export const MainLayout = useDeps(depsToPropsMapper)(Layout);
export default MainLayout;
