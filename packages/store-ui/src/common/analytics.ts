import { differenceInMinutes } from 'date-fns';

const SESSION_DURATION_MIN = 30;
const SESSION_STORAGE_NAME = 'sessionInfo';

export interface SessionInfo {
  id: number;
  startTimestamp: number;
  pageVisits: number;
  initialReferrer?: string;
  previousPage?: string;
}

const initializeSession = () => {
  setSessionInfo({
    id: Date.now(),
    startTimestamp: Date.now(),
    pageVisits: 0,
    previousPage: location.href,
    initialReferrer: document.referrer,
  });
};

const setSessionInfo = (data?: SessionInfo) => {
  localStorage.setItem(SESSION_STORAGE_NAME, JSON.stringify(data));
};

const getSessionInfo = (): SessionInfo | undefined => {
  const info = localStorage.getItem(SESSION_STORAGE_NAME);
  return info ? JSON.parse(info) : undefined;
};

const getSessionDefaultProperties = () => {
  const sessionInfo = getSessionInfo();

  return {
    pageVisits: sessionInfo.pageVisits,
    previousPage: sessionInfo.previousPage,
    currentPage: location.href,
  };
};

const isSessionExpired = () => {
  const sessionInfo = getSessionInfo();

  if (
    sessionInfo &&
    differenceInMinutes(Date.now(), sessionInfo.startTimestamp) <
      SESSION_DURATION_MIN
  ) {
    return false;
  }

  return true;
};

export enum AnalyticsEvents {
  openStore = 'open store',
  viewProduct = 'view product',
  viewCart = 'view cart',
  register = 'register',
  addAddress = 'add address',
  addItemToCart = 'add item to cart',
  removeItemFromCart = 'remove item from cart',
  checkout = 'checkout',
  order = 'order',
  pay = 'pay',
}

export const session = {
  initializeSession,
  setSessionInfo,
  getSessionInfo,
  getSessionDefaultProperties,
  isSessionExpired,
};
