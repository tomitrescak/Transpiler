export function isAdmin(user: any) {
  return playsRole(user, 'admin');
}

export function playsRole(user: any, role: string) {
  return user && user.roles && user.roles.indexOf('role') >= 0;
}
