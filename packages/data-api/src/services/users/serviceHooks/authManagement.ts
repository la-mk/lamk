import { HookContext } from '@feathersjs/feathers';
import { checkContext } from 'feathers-hooks-common';
import { differenceInHours } from 'date-fns';

const RESET_TOKEN_VALIDITY_HOURS = 2;

export const createAuthManagementForUser = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['create']);
  const user = ctx.result;
  const { email } = user;

  await ctx.app.services['authManagement'].create(
    { email: email },
    { user, authenticated: true },
  );
};

export const removeAuthManagementForUser = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['remove']);

  const user = ctx.result;
  const userAuthManagement = await ctx.app.services['authManagement'].find({
    query: { email: user.email },
    user,
    authenticated: true,
  });

  if (userAuthManagement.total === 0) {
    return;
  }

  await ctx.app.services['authManagement'].remove(
    userAuthManagement.data[0]._id,
    {
      user,
      authenticated: true,
    },
  );
};

export const hasEmailAndValidResetToken = async (ctx: HookContext) => {
  const { resetToken, email } = ctx.params.query ?? {};
  if (!resetToken || !email) {
    return false;
  }

  const authManagementResult = await ctx.app.services['authManagement'].find({
    query: { email },
  });

  // Only allow using a reset token just once, so we don't get bruteforce attacked.
  await ctx.app.services['authManagement'].patch(
    null,
    {
      resetToken: null,
      resetTokenCreatedAt: null,
    },
    { query: { email } },
  );

  if (authManagementResult.total < 1) {
    return false;
  }

  const {
    resetToken: dbResetToken,
    resetTokenCreatedAt,
  } = authManagementResult.data[0];

  if (!dbResetToken || !resetTokenCreatedAt) {
    return false;
  }

  const hasExpired =
    differenceInHours(Date.now(), new Date(resetTokenCreatedAt)) >
    RESET_TOKEN_VALIDITY_HOURS;

  if (resetToken !== dbResetToken || hasExpired) {
    return false;
  }

  // We remove the resetToken from the query parameters, since that is not a user model property and it won't match anything.
  if (ctx.params.query) {
    delete ctx.params.query.resetToken;
  }

  return true;
};
