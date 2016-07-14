import * as React from 'react';
import Alert from 'react-s-alert';
import Helmet from 'react-helmet';
import Modal from '../../core/components/modal_view';
import { CenteredLoading } from '../../core/components/loading_view';
import { UserView } from 'meteor/tomi:accountsui-semanticui-redux';

export interface IComponentProps {
  user: SystemUser;
  loggingIn: boolean;
  children: any;
}

const ClearLayout = ({ user, loggingIn, children }: IComponentProps) => (
  <Choose>
    <When condition={loggingIn}>
      <span>
        <Helmet
          titleTemplate="Clara's World / Logging In"
          />
        <CenteredLoading text="loggingIn" />
      </span>
    </When>
    <Otherwise>
      <main>
        <span style={{display: 'none'}}><UserView /></span>
        <Helmet
          titleTemplate="Clara's World / %s"
          script={[{'src': '/compiler/java2js.js', 'type': 'text/javascript'}]}
         />
        <span>{ children }</span>
        <Modal/>
        <Alert />
        {/* <Notifier/> */}
      </main>
    </Otherwise>
  </Choose>
);

export default ClearLayout;
