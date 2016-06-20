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
`

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
