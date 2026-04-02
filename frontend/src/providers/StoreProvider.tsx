"use client";

import {Provider} from "react-redux";
import {persist, store} from "@/store";
import {PersistGate} from "redux-persist/integration/react";

export function StoreProvider({children}: {children: React.ReactNode}) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persist}>
        {children}
      </PersistGate>
    </Provider>
  );
}
