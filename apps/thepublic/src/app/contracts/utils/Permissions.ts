export interface User {
  roles: string[];
  permissions: string[];
}

export const userHasPermission = (user: User, action: string): boolean => {
  // Example check for permissions
  return user.roles.includes('admin') || user.permissions.includes(action);
};