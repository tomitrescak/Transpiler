import React from "react";
import { Text } from 'semanticui-react';
import jss from '../../../configs/jss';

interface ILoadingParams {
  what?: string;
}

// class CenteredLoading extends React.Component<ILoadingParams, {}> {
//   render() {
//     return (
//       <div id="editorLoader">
//         <div className="ui segment">
//           <img src="/images/loading.gif" alt="" />&nbsp; &nbsp; &nbsp; { mf(this.props.what) }
//         </div>
//       </div>
//     );
//   }
// }

export class EmptyLoading extends React.Component<ILoadingParams, {}> {
  render() {
    return (
      <span></span>
    );
  }
}

export class Loading extends React.Component<ILoadingParams, {}> {
  render() {
    return (
      <span>
        <div className="ui active small inline loader"></div>&nbsp; &nbsp; &nbsp; <Text text={this.props.what} />
      </span>
    );
  }
}

interface ICenteredProps {
  text?: string;
}

let centeredCss = jss({
  content: {
    top: '50%',
    width: '300px',
    position: 'absolute',
    left: '50%',
    'margin-left': '-150px'
  }
});

export const CenteredLoading = ({ text }: ICenteredProps) => (
  <div id="editorLoader" className={centeredCss.content}>
    <div className="ui segment">
      <div className="ui active small inline loader"></div>&nbsp; &nbsp; &nbsp; <Text text={text ? text : 'loading'} />
    </div>
  </div>
);

const MyLoading = ({error}: any) => (
  <span>
    <div className="ui active small inline loader"></div>&nbsp; &nbsp; &nbsp; <Text text="loading" />
    { error && console.error(error) }
  </span>
);

export default MyLoading;


// export default new Loading();

// export default function ComposeLoading(what: string) {
//   return () => <Loading what={what} />;
// }
