import { useDeps } from 'mantra-core';
import Layout from '../components/layout';

const depsToPropsMapper = (context: IContext) => ({
  store: context.Store,
});

export const MainLayout = useDeps(depsToPropsMapper)(Layout);
export default MainLayout;
