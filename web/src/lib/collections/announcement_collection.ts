import { Mongo } from 'meteor/mongo';
// import { Roles } from 'meteor/alanning:roles';
// import { Meteor } from 'meteor/meteor';

declare global {
  export interface IAnnouncemenentsDAO {
    _id?: string;
    text: string;
    visible: boolean;
    group: string;
    tutorId: string;
    date: Date;
    dateTill: Date;
  }
}

export let Announcemenets: Mongo.Collection<IAnnouncemenentsDAO> = new Mongo.Collection<IAnnouncemenentsDAO>('announcemenets');
export default Announcemenets;
