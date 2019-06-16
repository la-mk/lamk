export const getUserInfo = (state: any) => {
  const user = state.user;

  // Return any async data together with a state object so we can deal with all errors and spinners in a standardized manner.
  return {
    data: user.userInfo,
    state: {
      isFetching: user.isFetchingUserInfo,
      error: user.errorUserInfo,
    },
  };
};
