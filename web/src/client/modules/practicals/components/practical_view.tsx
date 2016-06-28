import * as React from 'react';
import SearchBar from '../../core/components/search_bar_view';
import ExerciseItem from '../../exercises/containers/exercise_item_container';
import TutorModal from '../../schedules/containers/schedule_subscription_container';

import { Breadcrumb, Breadcrumbs, Segment, Header2, Button, Text, Label, Items } from 'semanticui-react';

export interface IComponentQuery {
  secretData: any;
  practicalData: any;
  scheduleData: any;
  solutionData: any;
}

export interface IComponentProps {
  user: SystemUser;
  context: IContext;
  filter: string;
}

export interface IComponentActions {
  createPractical: () => void;
  handleSearch: (text: string) => void;
}

export interface IComponent extends IComponentProps, IComponentActions, IComponentQuery { }

let exercise: IExerciseDAO;
let index: number;

export const PracticalView = ({ context, practicalData, scheduleData, secretData, user, createPractical, handleSearch, filter }: IComponent, ctx: any) => {
  const schedule: IScheduleDAO = scheduleData.schedule;
  const practical: IPracticalDAO = practicalData.practical;
  const userSecret: string = secretData.userSecret;
  const dueDate: Date = schedule.items.find(w => w.practicalId === practical._id).due;
  const { Utils } = context;
  const e = Utils.Router.encodeUrlName;

  // filter exercises based by search string
  let { exercises } = practical;
  if (filter) {
    const reg = new RegExp('.*' + filter + '.*', 'i');
    exercises = exercises.filter((s: IExerciseDAO) => s.name.match(reg));
  }

  return (
    <div>
      <Breadcrumbs dividerIcon="right angle white">
        <Breadcrumb link="/schedules" text="schedules.label" />
        <Breadcrumb link={`/schedule/${e(schedule.name)}/${schedule._id}`}>{schedule.name}</Breadcrumb>
        <Breadcrumb>{ practical.name }</Breadcrumb>
      </Breadcrumbs>

      <Segment attached="top" classes="form">
        <Header2 icon="archive">
          <a href="javascript:;" className="practicalTitle"  onClick={() => context.Utils.Ui.showMarkdownModal(practical.description) }>{ practical.name }</a>
          <If condition={user && user.isRole(['tutor']) }>
            <Button url={`/marking/${schedule._id}/${practical._id}`} labeled="left" floated="right" icon="legal" color="primary" text="tutor.marking" />
            <Button url={`/resultscsv?scheduleId=${schedule._id}&practicalId=${practical._id}&token=${userSecret}`} floated="right" color="primary" target="_self" icon="cloud download" />
          </If>
          <If condition={user && user.canWrite(practical.permissions) }>
            <Button url={`/admin/practical/${e(practical.name)}/${practical._id}`} floated="right" color="orange" icon="edit" />
          </If>
          <If condition={practical.exercises.find((p) => p.solution != null) }>
            <Button url={`/zip?scheduleId=${schedule._id}&practicalId=${practical._id}&token=${userSecret}`} floated="right" labeled="left" icon="compress" target="_self" text="downloadZIP" />
          </If>
          <Button url={`leaderboard/${e(schedule.name)}/${e(practical.name)}/${schedule._id}/${practical.image}`}
            floated="right" color="green" icon="trophy" />
        </Header2>
        <SearchBar placeHolder="practical.search" onUserInput={handleSearch} />

        <div>
          <Choose>
            <When condition={exercises.length > 0}>
              <Items key="exerciseView">
                <For each="exercise" index="index" of={exercises}>
                  <ExerciseItem key={index} exerciseId={exercise._id} practical={practical} schedule={schedule}  />
                </For>
              </Items>
            </When>
            <When condition={user && user.canWrite(practical.permissions) }>
              <Button labeled="right" color="primary" icon="plus" text="exercise.add" onClick={createPractical} />
              <Text text="confirm.createExercise" />
            </When>
            <Otherwise>
              <Text text="search.empty" />
            </Otherwise>

          </Choose>
        </div>
      </Segment>
      <If condition={dueDate}>
        <Segment attached="bottom" style={{ textAlign: 'right' }}>
          <Label color={ new Date() > dueDate ? 'red' : 'default'}><Text text="due" />{ Utils.Ui.relativeDate(dueDate) }</Label>
        </Segment>
      </If>
      { user && schedule.tutors.length > 0 && <TutorModal scheduleId={schedule._id} tutors={schedule.tutors} /> }
    </div>
  );
};

export default PracticalView;
