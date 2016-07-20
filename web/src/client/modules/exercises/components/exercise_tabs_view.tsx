import * as React from 'react';
import { Tabs, Tab } from 'semanticui-react';
import MarkdownView from '../../core/containers/markdown_container';
import HistoryView from '../../history/history_container';
import CommentsView from '../containers/exercise_comments_container';
import jss from '../../../configs/jss';


const css = jss({
  container: {
    '& .menu .item': {
      height: '30px',
      'margin': '10px 3px 0px 3px'
    },
    '& .item': {
      color: 'white!important',
      cursor: 'pointer',
      '&.active': {
        color: 'black!important',
      }
    },
    '& .tab.segment': {
      position: 'absolute!important',
      left: '0px',
      top: '40px',
      margin: '0px!important',
      'border-radius': '0px',
      border: '0px',
      overflow: 'auto'
    }
  },
  toolButtons: {
    position: 'absolute!important',
    right: '0px',
    top: '4px',
    //width: '100px';
    //border: '1px solid #444'
  }
});

export interface IComponentProps {
  user: SystemUser;
  practical: IPracticalDAO;
  exercise: IExerciseDAO;
  solution: ISolutionDAO;
}

interface IComponent extends IComponentProps { }

const ExerciseTabs = ({ user, practical, exercise, solution }: IComponent) => (
  <Tabs id="exercise" containerClass={css.container} >
    <Tab name="board" text="board">
      <div>board</div>
    </Tab>
    <Tab name="description" text="description">
      <MarkdownView text={exercise.description} />
    </Tab>
    <If condition={practical.lecture}>
      <Tab name="lecture" text="lecture">
        <MarkdownView text={practical.lecture} />
      </Tab>
    </If>
    <If condition={user.isRole(['admin', 'tutor'])}>
      <Tab name="history" text="history">
        <HistoryView solutionId={solution._id} />
      </Tab>
    </If>
    <Tab name="comments" text="comments">
      <CommentsView solutionId={solution._id} />
    </Tab>
  </Tabs>
);

export default ExerciseTabs;
