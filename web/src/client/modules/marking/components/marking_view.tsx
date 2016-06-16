import React from 'react';
import { Grid, Column } from 'semanticui-react';
import MarkingForm from '../containers/marking_form_container';
import MarkingList from '../containers/mark_list_container';

interface IProps {
  id: string;
}

const component = ({ id }: IProps) => (
  <Grid>
    <Column width={10}>
      <MarkingForm />
    </Column>
    <Column width={6}>
      <MarkingList id={id} />
    </Column>
  </Grid>
)

export default component;

//
