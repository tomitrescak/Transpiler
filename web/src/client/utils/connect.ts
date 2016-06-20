import { connect } from 'react-apollo';
import context from '../configs/context';

interface IConnectFunctions {
  mapStateToProps?: Function;
  mapDispatchToProps?: Function;
  mapQueriesToProps?: Function;
  mapMutationsToProps?: Function;
}

export default function connectWithMantra(props: IConnectFunctions): any {
  const modified = {};
  if (props.mapStateToProps) {
    modified['mapStateToProps'] = (state: any, ownProps: any) => props.mapStateToProps(context(), state, ownProps);
  }
  if (props.mapDispatchToProps) {
    modified['mapDispatchToProps'] = (state: any, ownProps: any) => props.mapDispatchToProps(context(), state, ownProps);
  }
  if (props.mapQueriesToProps) {
    modified['mapQueriesToProps'] = (state: any, ownProps: any) => props.mapQueriesToProps(context(), state, ownProps);
  }
  if (props.mapMutationsToProps) {
    modified['mapMutationsToProps'] = (state: any, ownProps: any) => props.mapMutationsToProps(context(), state, ownProps);
  }
  return connect(modified);
}
