import * as React from 'react';
import { Text, Header1, Button, Jumbo } from 'semanticui-react';

interface IProps {
  loggingIn: boolean;
  enter: Function;
}

export const JumboView = ({ loggingIn, enter }: IProps) => (
  <Jumbo inverted classes="hidden information">
    <Header1 inverted text="home.topIntroduction" />
    <p><Text text="home.bottomIntroduction" /></p>
    <If condition={loggingIn}>
      <Button size="large" color="primary" loading text="home.loggingIn" />
    <Else />
      <Button size="large" color="primary" onClick={enter} text="home.enterClara" />
    </If>
  </Jumbo>
);

export default JumboView;
