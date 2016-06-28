import configjss from 'jss';
import nested from 'jss-nested';
import vendorPrefixer from 'jss-vendor-prefixer';

const jss = configjss;
jss.use(nested());
jss.use(vendorPrefixer());

export default (obj: any) => {
    return jss.createStyleSheet(obj).attach().classes;
};
