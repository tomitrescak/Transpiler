const schema = `
  type PermissionGroup {
    name: String
    access: Int
  }

  type Permissions {
    owner: String
    ownerAccess: Int
    groups: [PermissionGroup]
    otherAccess: Int
  }


  input PermissionGroupInput {
    name: String
    access: Int
  }

  input PermissionsInput {
    owner: String
    ownerAccess: Int
    groups: [PermissionGroupInput]
    otherAccess: Int
  }
`;

const resolvers = {
  Permissions: {
    groups(permissions: IPermissionsDAO) {
      return permissions.groups;
    }
  }
};

export default {
  schema,
  resolvers
};
