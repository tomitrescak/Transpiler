import React from "react";
import { Segment, Grid, Column, Header3, Text } from 'semanticui-react';
import jss from '../../../configs/jss';

const css = jss({
  segment: {
    'border-radius': '0px!important',
    '& .segment h2': {
      'font-size': '3em!important',
      'margin-bottom': '1em!important'
    },
    'margin': '-1px!important',
    'padding': '3rem 0rem!important',
    '& p': {
      'min-height': '50px'
    },
  }
});

//////////////////////////////////////////////////////////////////////////////
// ExtraFooterView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

export const ExtraFooterView = () => (
  <div>
    <Segment classes={css.segment}>
      <Grid align="center">
        <Column width={16}>
          <Grid columns={3} stackable page divided align="center">
            <Column>
              <Header3 image="/images/wsulogo.png" iconOnTop text="partner.label" />
              <p><Text text="partner.info" /></p>
            </Column>
            <Column>
              <Header3 image="/images/acslogo.jpeg" iconOnTop text="awards.label" />
              <p><Text text="awards.info" /></p>
            </Column>
            <Column>
              <Header3 iconOnTop image="/images/reactlogo.png" text="technology.label" />
              <p><Text text="technology.info" /></p>
            </Column>
          </Grid>
        </Column>
      </Grid>
    </Segment>
    <Segment classes={css.segment}>
      <Grid align="center">
        <Column width={16}>
          <Grid columns={3} stackable page divided align="center">
            <Column>
              <Header3 iconOnTop icon="student" text="course.label" />
              <p><Text text="course.info" /></p>
            </Column>
            <Column>
              <Header3 iconOnTop icon="code" text="library.label" />
              <p><Text text="library.info" /></p>
            </Column>
            <Column>
              <Header3 iconOnTop icon="user" text="community.label" />
              <p><Text text="community.info" /></p>
            </Column>
          </Grid>
        </Column>
      </Grid>
    </Segment>
    {/*
        <div className="ui vertical feature segment" style={{position: "inherit"}}>
            <div className="ui centered page grid">
                <div className="column">
                    <h4 className="ui icon center aligned inverted header">
                        <i className="game icon" />
                        <div className="content">
                            { mf("home.tryItout") }
                        </div>
                    </h4>
                    <div className="pageExercise">
                        <div>
                            <ExerciseView scheduleName="Archive" practicalName="Easy" exerciseName="Leaf Line" />
                        </div>
                    </div>
                </div>
            </div>
        </div>*/}
  </div>
);

export default ExtraFooterView;
