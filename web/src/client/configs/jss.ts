import configjss from 'jss';
import nested from 'jss-nested';

const jss = configjss;
jss.use(nested());

export default (obj) => {
    return jss.createStyleSheet(obj).attach().classes;
};
