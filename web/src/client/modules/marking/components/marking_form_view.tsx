import React from 'react';
import { Form, Dropdown, DropdownItem, Button, Grid, Column, Input } from 'semanticui-react';
import {connect} from 'react-redux';
import { totalMark } from '../../../helpers/number_helpers';

export interface IComponentProps {
  mark: IResult;
}

export interface IComponentActions {
  changeStudent: (student: string) => void;
  assignResult: (index: number, results: any) => void;
  save: () => void;
}

export interface IComponent extends IComponentProps, IComponentActions { }

const markTemplates = [
  {
    title: 'Clara and the Ghosts must be able to move from one side of the game to the other with the “wrapAroundWorld()” method',
    options: [['Ok', 0.25], ['Nok', '0']]
  },
  {
    title: 'Clara must be capable of being controlled with at least the arrow keys on the keyboard',
    options: [['Ok', 0.3], ['Nok', '0']]
  },
  {
    title: 'Clara must not move in the game until after an arrow key pressed',
    options: [['Ok', 0.5], ['Nok', '0']]
  },
  {
    title: 'Clara must stop before hitting trees or the ghost wall',
    options: [['Ok', 0.3], ['Only wall or only trees', 0.15], ['Nok', '0']]
  },
  {
    title: 'Clara must be able to eat leaves, and play the appropriate sound when doing so',
    options: [['Ok', 0.3], ['No sound', 0.15], ['Nok', '0']]
  },
  {
    title: 'When all the leaves are eaten, the game must progress to the next level',
    options: [['Ok', 0.3], ['Nok', '0']]
  },
  {
    title: 'When each level starts the intro sound must be played once for each level and Clara and the Ghosts must not be able to move until after the intro sound has completed playing',
    options: [['Ok', 0.5], ['Intro playing, clara or ghost are moving', 0.25], ['Nok', '0']]
  },
  {
    title: 'Ghosts must move slower than Clara when moving normally and when scared',
    options: [['Ok', 0.25], ['Nok - Ghost are moving at constant speed', '0']]
  },
  {
    title: 'Ghosts must stop before hitting trees',
    options: [['Ok', 0.25], ['Nok', '0']]
  },
  {
    title: 'Ghosts must randomly decide on a direction to go in when they find themselves in an intersection',
    options: [['Ok', 2], ['Ghost are not deciding only once per intersection', 1.25], ['Decision is not random', 1], ['Some logic is there, but does not work', 1], ['Nok', '0']]
  },
  {
    title: 'When Clara and a Ghost collide, and the Ghost is neither dead nor scared, she must die, and play the appropriate sound',
    options: [['Ok', 0.5], ['No sound', 0.25], ['Nok', '0']]
  },
  {
    title: 'When Clara is dead the player must not be able to continue controlling her',
    options: [['Ok', 0.5], ['Nok', '0']]
  },
  {
    title: 'Clara must be able to eat mushrooms, and this must make the Ghosts scared',
    options: [['Ok', 0.3], ['Animation is not working properly', 0.25], ['Nok', '0']]
  },
  {
    title: 'When the Ghosts are scared, they must run the appropriate animation',
    options: [['Ok', 0.5], ['Animation not running properly', 0.25], ['Nok', '0']]
  },
  {
    title: 'When Clara and a Ghost collide, and the Ghost is scared, the Ghost must die, play the appropriate sound and play the appropriate animation',
    options: [['Ok', 0.5], ['Animation is not working properly', 0.25], ['No sound', 0.25], ['Nok', '0']]
  },
  {
    title: 'When Ghosts are dead they must attempt to return to the Ghost Healer',
    options: [['Ok', 2], ['Ghosts are getting stuck', 1], ['Some logic is there, but does not work', 1], ['Nok', '0']]
  },
  {
    title: 'When Ghosts collide with the Ghost Healer they must no longer be dead',
    options: [['Ok', 0.25], ['Nok', '0']]
  },
  {
    title: 'You must make, at a minimum, one extra level',
    options: [['Ok', 0.5], ['Level is the same as Level 1', 0.25], ['Nok', '0']]
  }
];

function formatResult(res: any) {
  return res.title + '\n\n' + res.text + '\n----------------------\n\n';
}


const mapStateToProps = (state: IState) => ({
  mark: state.mark
});

const ResultView = ({mark}: IComponentProps) => {
  let result = '';
  mark.result.forEach((res: any, index: any) => {
      result += formatResult(res);
  });

  return (
    <div>
      Mark: { totalMark(mark.result) }
      <textarea rows="20" style={{ width: '100%' }} value={result}>
      </textarea>
    </div>
  )
}

const Result = connect(mapStateToProps)(ResultView);


const component = ({ assignResult, changeStudent, mark, save }: IComponent) => {
  let student: Input = null;
  return (
    <Grid>
      <Column width={10}>
        <Form>
          <Input label="Student" ref={(node) => student = node}
            placeholder="Name or ID" value={mark.student}
            onChange={() => changeStudent(student.value) } />
          {
            markTemplates.map((template, index) => {
              return <Dropdown id={'option' + index}
                activation="hover"
                key={index}
                label={template.title}
                defaultText="Please select ..."
                defaultValue={mark && mark.result[index] ? mark.result[index].value : null}
                // onInit={(elem: any) => {
                //   assignResult(index, { value: parseFloat(elem.dropdown('get value')), text: elem.dropdown('get text'), title: template.title });
                // }}
                onChange={(value, text) => {
                  assignResult(index, { value, text, title: template.title });
                } }>
                {
                  template.options.map((option, oindex) => {
                    return <DropdownItem key={oindex} text={`${option[0]} --- (${option[1]} from ${template.options[0][1]})`} value={option[1]} />;
                  })
                }
              </Dropdown>;
            })
          }
          <Button text="Save" onClick={() => save() } />
        </Form>
      </Column>
      <Column width={6}>
        <Result />
      </Column>
    </Grid>
  )
};

// result view

export default component;


// <Grid>
//   <Column width={10}>
//     <Form>
//       <Input label="Student" ref={(node) => student = node} placeholder="Name or ID" defaultValue={mark.student} />
//       {
//         markTemplates.map((template, index) => {
//           return <Dropdown id={'option' + index}
//             activation="hover"
//             key={index}
//             label={template.title}
//             defaultText="Please select ..."
//             defaultValue={mark && mark.result[index] ? mark.result[index].value : null}
//             onChange={(value, text) => {
//               assignResult(index, { value, text, title: template.title });
//             } }>
//             {
//               template.options.map((option, oindex) => {
//                 return <DropdownItem key={oindex} text={`${option[0]} --- (${option[1]} from ${template.options[0][1]})`} value={option[1]} />;
//               })
//             }
//           </Dropdown>;
//         })
//       }
//       <Button text="Save" onClick={() => save(mark._id, count(mark.result), mark.student)} />
//     </Form>
//   </Column>
//   <Column width={6}>
//     <Result />
//   </Column>
// </Grid>
