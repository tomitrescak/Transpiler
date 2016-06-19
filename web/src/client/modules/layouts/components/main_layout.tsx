import React from 'react';
import Alert from 'react-s-alert';
import Helmet from 'react-helmet';
import Modal from '../../core/components/modal_view';
import Footer from '../../core/components/footer_view';
import UnsupportedBrowser from '../../core/components/unsupported_browser_view';

import HeaderView from '../../core/components/header_view';
import AuthContainer from '../../core/containers/auth_container';

import { Segment, Grid, Column } from 'semanticui-react';
import jss from '../../../configs/jss';

const Header = AuthContainer(HeaderView);

// styles

const css = jss({
  content: {
    'padding-bottom': '140px',
  },
  masthead: {
    'background-color': 'transparent!important',
    margin: '0em',
    padding: '5rem 0rem',
    'border-radius': '0!important'
  }
});

// component

interface IProps {
  content: any;
  context: IContext;
  extraFooter?: any;
  main?: any;
  loggingIn: boolean;
}

export class Layout extends React.Component<IProps, {}> {
  checkBrowser() {
    if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) !== -1) {
      return false;
    } else if ((navigator.userAgent.indexOf('MSIE') !== -1) || (!!document['documentMode'] === true)) {
      return false;
    }
    return true;
  }

  render() {
    if (!this.checkBrowser()) {
      return (
        <UnsupportedBrowser />
      );
    }
    return (
      <main id="home" >
        <div id="content" className={css.padding}>
          <Helmet titleTemplate="Clara's World / %s" />

          <Segment inverted classes={'masthead ' + css.masthead}>
            <Grid page>
              <Column>
                <Header />
                <If condition={this.props.loggingIn}>
                  ....
                  <Else />
                  <div id="main">
                    { this.props.children }
                    { this.props.main }
                  </div>
                </If>
              </Column>
            </Grid>
          </Segment>
          { this.props.extraFooter }
        </div>
        <div id="footer">

          <Footer />
        </div>
        <Modal />
        <Alert />
        {/* this.data.currentUser ? <Notifier /> : '' */}
      </main>
    );
  }

  componentWillMount() {
    this.props.context.Utils.Ui.pageTransition();
  }

  componentWillUpdate() {
    this.props.context.Utils.Ui.pageTransition();
  }
};


export default Layout;

/*
<div id="content">
  <Segment inverted classes={'masthead ' + css.masthead}>
    <Grid page>
      <Column>
        <Helmet titleTemplate="Clara's World / %s" />
        <Header />

        <If condition={this.props.loggingIn}>
          ....
          <Else />
          <div id="main">{ this.props.children }</div>
        </If>
      </Column>
    </Grid>
  </Segment>
</div>
<If condition={this.props.extraFooter }>
  { this.props.extraFooter }
</If>
<div id="footer">
  <Footer />
  <Modal />
  <Alert />
</div>
*/
