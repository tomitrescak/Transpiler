import * as React from 'react';

import StarRating from '../../core/components/star_rating_view';
import { Item, Button, Image, Label, Text } from 'semanticui-react';


export interface IComponentProps {
  exercise: IExerciseDAO;
  solution: ISolutionDAO;
  context: IContext;
  user: SystemUser;
}

export interface IComponentActions {
  removeSubmission: Function;
  submitSolution: Function;
}

interface IProps extends IComponentProps, IComponentActions {
  practical?: IPracticalDAO;
  schedule?: IScheduleDAO;
}



function checkTutor(event: React.SyntheticEvent, context: IContext, user: SystemUser, exercise: IExerciseDAO, practical: IPracticalDAO, schedule: IScheduleDAO) {
  if (!schedule) {
    return;
  }

  if (user) {
    if (schedule.tutors.length > 0) {
      if (!user.getSubscription(schedule._id)) {
        context.Utils.Ui.alertDialog('error.notSubscribed', 'error.subscriptionError');
        event.preventDefault();
        return false;
      }
    }
  }

  const e = context.Utils.Router.encodeUrlName;
  context.Utils.Router.go(`/exercise/${e(exercise.name)}/${e(practical.name)}/${e(schedule.name)}/${exercise._id}/${practical._id}/${schedule._id}`);
}

const ExerciseItemView = ({ context, user, solution, schedule, practical, exercise, removeSubmission, submitSolution }: IProps) => {

  const e = context.Utils.Router.encodeUrlName;

  return (
    <Item.Main>
      <Item.Image classes="image" src={exercise.image ? (context.Config.S3Bucket + exercise.image) : '/images/wireframe.png'}>
        <Label style={{cursor: 'pointer'}} onClick={() => context.Utils.Ui.showMarkdownModal(exercise.description) } icon="search" corner="left" />
      </Item.Image>

      <Item.Content>
        <Item.Header>
          <If condition={user && user.canWrite(exercise.permissions) }>
            <Button compact color="orange" url={`/admin/exercise/${e(exercise.name)}/${exercise._id}`} icon="edit" />
          </If>
          <If condition={practical}>
            <a href="javascript:;" onClick={(event: React.SyntheticEvent) => checkTutor(event, context, user, exercise, practical, schedule) }>{ exercise.name }</a>
          </If>
          <If condition={practical == null}>
            { exercise.name }
          </If>

          <If condition={solution && solution.validated}>
            &nbsp;· <StarRating codeStars={solution.codeStars} stepsStars={solution.stepsStars} /> ·
                      {/*<Label color="green"  text="solution.completed" />*/}
                      <If condition={solution.status === 'Marked'}>
                        <Label color="blue" text="solution.mark">{ solution.mark }</Label>
                      </If>
          </If>
          <Choose>
            <When condition={solution && solution.status === 'Submitted'}>
              <Button icon="erase" floated="right" labeled="left" color="orange" onClick={() => removeSubmission(solution._id) } text="solution.removeSubmission" />
            </When>
            <When condition={solution && ( solution.status === 'Open' || !solution.status )}>
              <Button icon="edit" floated="right" labeled="left" color="green" onClick={() => submitSolution(solution._id) } text="solution.submit" />
            </When>
          </Choose>
        </Item.Header>
        <Item.Meta>
            <span className="cinema">
              <If condition={solution}>
                <span><Text text="modified" /> { context.Utils.Ui.relativeDate(solution.updatedAt)} · </span>
              </If>
              <If condition={exercise.points}>
                <span>{ exercise.points } <Text text="exercise.points" /></span>
              </If>
            </span>
        </Item.Meta>
        <Item.Description>{ context.Utils.Ui.previewMarkdown(exercise.description, 300) }</Item.Description>
      </Item.Content>
    </Item.Main>
  );
};

export default ExerciseItemView;
