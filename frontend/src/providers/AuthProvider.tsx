"use client";

import {useEffect} from "react";
import {useAppDispatch} from "@/store/hooks";
import {fetchUser} from "@/store/slices/auth/api";
import {fetchCategories} from "@/store/slices/categories/api";

export function AuthProvider({children}: {children: React.ReactNode}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchCategories());
  }, [dispatch]);

  return <>{children}</>;
}
