import React from 'react';

import { Meteor } from 'meteor/meteor';
import { Divider, Button, Label, Text } from 'semanticui-react';
import { mf } from '../../../configs/i18n';
import jss from '../../../configs/jss';

const css = jss({
  container: {
    float: 'left',
    position: 'relative',
    '& .label': {
      position: 'absolute',
      'z-index': 1000,
      top: 0,
    },
    '& img': {
      width: '50px',
      height: '50px',
    },
    '&.missing img': {
      opacity: 0.3
    },
    '&.hidden': {
      display: 'none'
    }
  }
});


let badgeCollection: ISystemBadge[][] = [];

interface ISystemBadge {
  code: number;
  rank: number;
  url: string;
  description: string;
}

interface IBadgeInfo {
  code: number;
  url: string;
  description: string;
  badgeClass?: string;
  badgeCount?: number;
}

export interface IComponentProps {
  badges: IAchievementsDAO[];
}

interface IBadgesViewState {
  allBadges: boolean;
}

export default class BadgesView extends React.Component<IComponentProps, IBadgesViewState> {
  constructor(props: IComponentProps) {
    super();
    this.state = {
      allBadges: false
    };
  }

  checkBadge(badge: ISystemBadge): IBadgeInfo {
    let showAll = this.state.allBadges;
    let myBadges = this.props.badges.filter((mybadge: IAchievementsDAO) => {
      return mybadge.type === badge.code && mybadge.rank === badge.rank;
    });

    let result: IBadgeInfo = {
      code: badge.code,
      url: badge.url,
      description: badge.description,
      badgeClass: '',
      badgeCount: 0
    };

    if (myBadges.length > 0) {
      myBadges.forEach((doc: IAchievementsDAO) => {
        result.badgeCount += doc.count != null ? doc.count : 1;
      });
    } else {
      if (showAll) {
        result.badgeClass = 'missing';
      } else {
        result.badgeClass = 'hidden';
      }
    }

    return result;
  }

  toggleAll() {
    this.setState({
      allBadges: !this.state.allBadges
    });
  }

  render() {
    let badges: any[] = [];

    badgeCollection.map((badgeGroup: ISystemBadge[], parentIndex: number) => {
      badgeGroup.map((badge: ISystemBadge, myindex: number) => {
        let myBadge = this.checkBadge(badge);
        badges.push(
          <div key={parentIndex + '_' + myindex} className={ css.container + ' ' + myBadge.badgeClass}>
            { myBadge.badgeCount > 1 ? <a className="ui red circular label">{ myBadge.badgeCount }</a> : ''}
            <img src={'/images/badges/' + myBadge.url + '.png'} className="badgeImage" data-content={myBadge.description} />
          </div>
        );
      });
    });

    return (
      <If condition={this.props.badges.length}>
        <div>
          <Divider icon="trophy" orientation="horizontal">
            <Label circular color="blue">{ this.props.badges.length }</Label>
          </Divider>
          <If condition={this.props.badges.length === 0}>
            <div style={{ clear: 'both' }}><Text text="noBadges" /></div>
          </If>
          {/* BADGE COLLECTION */ }
          <div style={{ float: 'left' }}>{badges}</div>
          {/* BUTTON */ }
          <Button compact classes="right floated" onClick={this.toggleAll.bind(this) } text="toggleAll" />
          <div style={{ clear: 'both' }} />
        </div>
      </If>
    );
  }
}

//////////////////////////////////////////////////////////////////////////////
// HELPERS                                                                  //
//////////////////////////////////////////////////////////////////////////////

// add exercises
// mf ('BadgeExercise1Stars', ''); mf ('BadgeExercise2Stars', ''); mf ('BadgeExercise3Stars', '');
// mf ('BadgeExercise4Stars', ''); mf ('BadgeExercise5Stars', '');
// mf ('BadgePractical1Stars', ''); mf ('BadgePractical2Stars', ''); mf ('BadgePractical3Stars', '');
// mf ('BadgePractical4Stars', ''); mf ('BadgePractical5Stars', '');
// mf ('BadgeSchedule1Stars', ''); mf ('BadgeSchedule2Stars', ''); mf ('BadgeSchedule3Stars', '');
// mf ('BadgeSchedule4Stars', ''); mf ('BadgeSchedule5Stars', '');
// mf ('BadgeSpeed1Stars', ''); mf ('BadgeSpeed2Stars', ''); mf ('BadgeSpeed3Stars', '');
// mf ('BadgeSpeed4Stars', ''); mf ('BadgeSpeed5Stars', '');
// mf ('BadgeSteps1Stars', ''); mf ('BadgeSteps2Stars', ''); mf ('BadgeSteps3Stars', '');
// mf ('BadgeSteps4Stars', ''); mf ('BadgeSteps5Stars', '');
// mf ('BadgeLoc1Stars', ''); mf ('BadgeLoc2Stars', ''); mf ('BadgeLoc3Stars', '');
// mf ('BadgeLoc4Stars', ''); mf ('BadgeLoc5Stars', '');

function initBadges(code: number, name: string, reverse = true, count = 5) {
  let group: ISystemBadge[] = [];
  for (let i = 1; i <= count; i++) {
    let rank = reverse ? (6 - i) : i;
    let langCode = 'Badge' + name + i + 'Stars';
    group.push({ code: code, rank: rank, url: (name + i), description: mf(langCode) });
  }
  badgeCollection.push(group);
}

Meteor.startup(() => {
  initBadges(2, 'Exercise');
  initBadges(3, 'Practical');
  initBadges(4, 'Schedule');
  initBadges(5, 'Speed', false);
  initBadges(6, 'Loc', false);
  initBadges(7, 'Steps', false);

  let group: ISystemBadge[] = [];
  group.push({ code: 0, url: 'Loc', description: mf('BadgeLocMaxStars'), rank: null });
  group.push({ code: 1, url: 'Steps', description: mf('BadgeStepsMaxStars'), rank: null });
  badgeCollection.push(group);
});
