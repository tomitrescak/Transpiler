export const SECRET = 'USER: secret';

export function assignSecret(secret: string) {
  return {
    type: SECRET,
    secret
  };
}

export function getUserSecret(context: IContext) {
  return context.Apollo.query({
    query: `
      query userSecret {
        userSecret
      }
    `,
    thenCallback(data: any, dispatch: any) {
      dispatch(assignSecret(data.userSecret));
    },
    errorCallback() {
      debugger;
    },
    catchCallback() {
      debugger;
    }
  });
}
