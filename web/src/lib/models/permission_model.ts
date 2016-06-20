import { Meteor } from 'meteor/meteor';
import Event from 'eventobject';
import { isAdmin, playsRole } from '../helpers/data_helpers';

declare global {
  export interface IPermission extends IPermissionsDAO {
    getDAO(): IPermissionsDAO;
    canRead(permission: IPermission, user: Meteor.User): boolean;
    canWrite(permissions: IPermission, user: Meteor.User): boolean;
    addGroup(groupName: string, accessValue: number): void;
    removeGroup(groupName: string): void;
    changeGroupAccess(groupName: string, access: number): void;
  }
}

/**
 * @class Permission
 */
export class Permission {
  static GroupsChangedEventName = 'GroupsChanged';

  /**
   * Id of the owner
   * @property owner
   * @return {string}
   */
  owner: string;
  /**
   * Access level for owner [0 - none, 1 - read, 2 - write, 3 - read/write]
   * @property ownerAccess
   * @return {number}
   */
  ownerAccess: number;
  /**
   * Permission groups
   * @property groups
   * @return {Array<{name: String, access: int, accessFrom: Date, accessTill: Date}>}
   */
  get groups(): IPermissionGroupDAO[] {
    return this._groups;
  }
  /**
   * Access level for all other users [0 - none, 1 - read, 2 - write, 3 - read/write]
   * @property otherAccess
   * @return {number}
   */
  otherAccess: number;

  groupsChanged = new Event();

  private _groups: IPermissionGroupDAO[];

  static permissionQuery(user: Meteor.User): any {
    // console.log(JSON.stringify(user, null, 2));
    // anonymous user can only access public content
    if (!user) {
      return {
        'permissions.otherAccess': { $gt: 0 }
      };
    }

    // admin can access everything
    if (isAdmin(user)) {
      return {};
    }

    // logged in user can access based on the ownership and group membership
    return {
      $or: [
        { 'permissions.owner': user._id },
        { 'permissions.otherAccess': { $gt: 0 } },
        {
          'permissions.groups': {
            $elemMatch: {
              $and: [
                { name: { $in: user.profile.groups } },
                { access: { $gt: 0 } }
              ]
            }
          }
        }
      ]
    };
  };

  static canRead(permission: Permission, user: Meteor.User) {
    if (user && isAdmin(user)) {
      return true;
    }

    return user != null && user._id === permission.owner ||
      permission.otherAccess >= 1 ||
      Permission.groupAccess(permission, user, 1);
  };

  static canWrite(permission: IPermissionsDAO, user: Meteor.User) {
    if (!user) {
      return false;
    }
    if (isAdmin(user)) {
      return true;
    }
    return user._id === permission.owner && permission.ownerAccess >= 3 ||
      permission.otherAccess >= 3 ||
      Permission.groupAccess(permission, user, 3);
  };

  static groupAccess(permission: IPermissionsDAO, user: Meteor.User, level: number) {
    if (user == null) {
      return false;
    }

    for (let i = 0; i < user.profile.groups.length; i++) {
      for (let j = 0; j < permission.groups.length; j++) {
        if (user.profile.groups[i] === permission.groups[j].name) {
          return permission.groups[j].access >= level;
        }
      }
    }
    return false;
  }

  static create(userId: string): Permission {
    return new Permission({ owner: userId, ownerAccess: 3, groups: [], otherAccess: 0});
  }

  constructor(doc: IPermissionsDAO) {
    if (!doc) {
      throw 'Permission must be specified';
    }

    this.owner = doc.owner;
    this.ownerAccess = doc.ownerAccess;
    this._groups = doc.groups;
    this.otherAccess = doc.otherAccess;
  }

  // init(owner, ownerAccess, otherAccess, groups) {
  //   this.owner = owner;
  //   this.ownerAccess = ownerAccess;
  //   this.otherAccess = otherAccess;
  //   this.groups = groups;
  //
  //   return this;
  // }

  addGroup(groupName: string, accessValue: number) {
    this.groups.push({ name: groupName, access: accessValue });
    this.triggerGroupsChanged();
  }

  removeGroup(groupName: string) {
    this._groups = this.groups.filter(function(group: IPermissionGroupDAO) {
      return group.name !== groupName;
    });
    this.triggerGroupsChanged();
  }

  changeGroupAccess(groupName: string, access: number) {
    for (let group of this.groups) {
      if (group.name === groupName) {
        group.access = access;
        break;
      }
    }
  }

  /**
   * @method canRead
   * @param {*} user
   */
  canRead(user: Meteor.User) {
    return Permission.canRead(this, user);
  }

  /**
   * @method canRead
   * @param user
   */
  canWrite(user: Meteor.User) {
    return Permission.canWrite(this, user);
  }

  getDAO(): IPermissionsDAO {
    return {
      owner: this.owner,
      ownerAccess: this.ownerAccess,
      groups: this.groups,
      otherAccess: this.otherAccess
    };
  }

  private triggerGroupsChanged() {
    this.groupsChanged.emit();
  }
}


export default Permission;
