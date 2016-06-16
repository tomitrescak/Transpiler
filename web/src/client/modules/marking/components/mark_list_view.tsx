import React from 'react';
import { List, ListItem, Button } from 'semanticui-react';

export interface IComponentProps {
  marks: any[];
  setResult: (res: any) => void;
  deleteResult: (res: any) => void;
}

const component = ({ marks, setResult, deleteResult }: IComponentProps) => {
  return (
  <List divided={true}>
    {
      marks.map((mark, index) => {
        return (
          <ListItem key={index}>
            <Button icon="wrench" color="blue" url={`/edit/${mark._id}`} />
            <Button icon="trash" color="red" onClick={() => { if (confirm('Really?')) { deleteResult(mark)} }} />
            { mark.student} ({mark.total} points)
          </ListItem>
        );
      })
    }
  </List>
)};

export default component;
