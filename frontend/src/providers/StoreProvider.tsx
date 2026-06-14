"use client";

import {useMemo} from "react";
import {Provider} from "react-redux";
import {store} from "@/store";
import {persistStore} from "redux-persist";
import {PersistGate} from "redux-persist/integration/react";

export function StoreProvider({children}: {children: React.ReactNode}) {
  const persistor = useMemo(() => persistStore(store), []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
