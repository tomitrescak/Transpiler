import React from "react";
import { Text } from 'semanticui-react';

interface ILoadingParams {
  what: string;
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

export const CenteredLoading = () => (
  <div id="editorLoader">
    <div className="ui segment">
      <div className="ui active small inline loader"></div>&nbsp; &nbsp; &nbsp;<Text text="loading" />)
    </div>
  </div>
);

const MyLoading = () => (
  <span>
    <div className="ui active small inline loader"></div>&nbsp; &nbsp; &nbsp;<Text text="loading" />
  </span>
);

export default MyLoading;


// export default new Loading();

// export default function ComposeLoading(what: string) {
//   return () => <Loading what={what} />;
// }
