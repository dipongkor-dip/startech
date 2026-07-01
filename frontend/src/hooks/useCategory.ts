import React, {useCallback} from "react";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {fetchCategories} from "@/store/slices/categories/api";
import {setCategories, clearCategories, clearError} from "@/store/slices/categories/categoriesSlice";
import {
  buildCategoryTree,
  findCategoryBySlug,
  findCategoryById,
  findParentChain,
  flattenCategories,
  getAllChildren,
  getCategoryBreadcrumb,
} from "@/lib/category-utils";
import {Category} from "@/store/slices/categories/interface";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Hook for categories state and operations
 */
export const useCategories = () => {
  const dispatch = useAppDispatch();
  const {categories, flatCategories, loading, error, lastFetched} = useAppSelector((state) => state.categories);

  const shouldRefetch = useCallback(() => {
    if (!lastFetched) return true;
    return Date.now() - lastFetched > CACHE_DURATION;
  }, [lastFetched]);

  const fetchCategoriesData = useCallback(async () => {
    if (categories.length > 0 && !shouldRefetch()) {
      return;
    }
    await dispatch(fetchCategories());
  }, [dispatch, categories.length, shouldRefetch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearCategories = useCallback(() => {
    dispatch(clearCategories());
  }, [dispatch]);

  const handleSetCategories = useCallback(
    (cats: Category[]) => {
      dispatch(setCategories(cats));
    },
    [dispatch]
  );

  return {
    categories,
    flatCategories,
    loading,
    error,
    lastFetched,
    fetchCategoriesData,
    clearError: handleClearError,
    clearCategories: handleClearCategories,
    setCategories: handleSetCategories,
  };
};

/**
 * Hook for searching and finding categories
 */
export const useCategorySearch = () => {
  const {categories, flatCategories} = useAppSelector((state) => state.categories);

  const findBySlug = useCallback(
    (slug: string) => {
      return findCategoryBySlug(categories, slug);
    },
    [categories]
  );

  const findById = useCallback(
    (id: string) => {
      return findCategoryById(categories, id);
    },
    [categories]
  );

  const getParentChain = useCallback(
    (slug: string) => {
      return findParentChain(categories, slug);
    },
    [categories]
  );

  const getBreadcrumb = useCallback(
    (slug: string) => {
      return getCategoryBreadcrumb(slug, categories);
    },
    [categories]
  );

  const getChildren = useCallback(
    (categoryId: string) => {
      const category = findCategoryById(categories, categoryId);
      return category?.child ?? [];
    },
    [categories]
  );

  const getAllChildrenFlat = useCallback(
    (categoryId: string) => {
      const category = findCategoryById(categories, categoryId);
      return category ? getAllChildren(category) : [];
    },
    [categories]
  );

  const getFlattened = useCallback(() => {
    return flattenCategories(categories);
  }, [categories]);

  return {
    findBySlug,
    findById,
    getParentChain,
    getBreadcrumb,
    getChildren,
    getAllChildrenFlat,
    getFlattened,
  };
};

/**
 * Hook to manage category tree operations
 */
export const useCategoryTree = () => {
  const {categories} = useAppSelector((state) => state.categories);

  const buildTree = useCallback((flatCategories: Category[]) => {
    return buildCategoryTree(flatCategories);
  }, []);

  const flatten = useCallback((tree: Category[]) => {
    return flattenCategories(tree);
  }, []);

  const hasChildren = useCallback((category: Category | undefined) => {
    return (category?.child?.length ?? 0) > 0;
  }, []);

  const getDepth = useCallback((categoryId: string, depth: number = 0): number => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category?.parentId) return depth;

    // Find parent and recurse
    const parent = categories.find((cat) => cat.id === category.parentId);
    return getDepth(parent?.id ?? "", depth + 1);
  }, [categories]);

  return {
    buildTree,
    flatten,
    hasChildren,
    getDepth,
  };
};

/**
 * Hook to get categories with loading and error states
 * Automatically fetches on mount if needed
 */
export const useCategoriesWithFetch = () => {
  const {categories, loading, error, fetchCategoriesData} = useCategories();

  // Fetch categories on mount if not already loaded
  React.useEffect(() => {
    if (!loading && categories.length === 0 && !error) {
      fetchCategoriesData();
    }
  }, [loading, categories.length, error, fetchCategoriesData]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategoriesData,
  };
};
