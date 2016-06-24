import configjss from 'jss';
import nested from 'jss-nested';

const jss = configjss;
jss.use(nested());

export default (obj: any) => {
    return jss.createStyleSheet(obj).attach().classes;
};
