import { IncomingMessage } from "http";
import { NextPageContext } from "next";
import { AppContext } from "next/app";
import { Store } from "../domain/store";

export type PageContextWithStore = Omit<NextPageContext, "req"> & {
  req: IncomingMessage & { store: Store };
};

export const injectStoreInContext = (store: Store | null, app: AppContext) => {
  if (!!store) {
    // @ts-ignore
    app.ctx.req.store = store;
  }
};
