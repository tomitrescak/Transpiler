import React from 'react';
import Alert from 'react-s-alert';
import Helmet from 'react-helmet';
import Modal from '../../core/components/modal_view';
import Header from '../../core/containers/header_container';
import Footer from '../../core/components/footer_view';
import UnsupportedBrowser from '../../core/components/unsupported_browser_view';

interface IProps {
  content: any;
  context: IContext;
  extraFooter?: any;
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
      <main id="home">
        <Helmet titleTemplate="Mantra - %s" />
        <div className="content">
          <div className="ui inverted masthead segment" style={{ borderRadius: 0 }}>
            <div className="ui page grid">
              <div className="column">
                <Header />
                <div id="main">{ this.props.children }</div>
              </div>
            </div>
          </div>
        </div>
        <If condition={this.props.extraFooter}>
          <div id="extraFooter">
            { this.props.extraFooter }
          </div>
        </If>
        <footer>
          <Footer />
        </footer>

        <Modal />
        {<Alert />}
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
