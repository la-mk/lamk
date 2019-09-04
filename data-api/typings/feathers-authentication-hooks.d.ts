declare module 'feathers-authentication-hooks' {
  export const queryWithCurrentUser: (options: any) => any;
  export const restrictToOwner: (options: any) => any;
  export const associateCurrentUser: (options: any) => any;
}
