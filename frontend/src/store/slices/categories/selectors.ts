import {RootState} from "@/store";
import {createSelector} from "@reduxjs/toolkit";
import {findCategoryBySlug, flattenCategories} from "@/lib/category-utils";

// Base selector
const selectCategoriesState = (state: RootState) => state.categories;

/**
 * Select hierarchical categories tree
 */
export const selectCategories = createSelector([selectCategoriesState], (state) => state.categories);

/**
 * Select flat categories array
 */
export const selectFlatCategories = createSelector([selectCategoriesState], (state) => state.flatCategories);

/**
 * Select loading state
 */
export const selectCategoriesLoading = createSelector([selectCategoriesState], (state) => state.loading);

/**
 * Select error state
 */
export const selectCategoriesError = createSelector([selectCategoriesState], (state) => state.error);

/**
 * Select last fetch timestamp
 */
export const selectLastFetched = createSelector([selectCategoriesState], (state) => state.lastFetched);

/**
 * Select all categories as flat list (memoized)
 */
export const selectAllCategoriesFlat = createSelector([selectCategories], (categories) => flattenCategories(categories));

/**
 * Select root categories only (no parents)
 */
export const selectRootCategories = createSelector([selectCategories], (categories) => categories);

/**
 * Select category count
 */
export const selectCategoryCount = createSelector([selectAllCategoriesFlat], (flatCategories) => flatCategories.length);

/**
 * Select categories by status
 */
export const selectActiveCategories = createSelector([selectAllCategoriesFlat], (flatCategories) => flatCategories.filter((cat) => cat.isActive !== false));

export const selectInactiveCategories = createSelector([selectAllCategoriesFlat], (flatCategories) => flatCategories.filter((cat) => cat.isActive === false));

/**
 * Select category by slug (factory function)
 */
export const selectCategoryBySlug = (slug: string) => createSelector([selectCategories], (categories) => findCategoryBySlug(categories, slug));

/**
 * Select is data fresh (within cache duration)
 */
export const selectIsCategoryDataFresh = createSelector([selectLastFetched], (lastFetched) => {
  if (!lastFetched) return false;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  return Date.now() - lastFetched < CACHE_DURATION;
});

/**
 * Select combined loading and error states
 */
export const selectCategoriesStatus = createSelector([selectCategoriesLoading, selectCategoriesError], (loading, error) => ({
  loading,
  error,
  hasError: !!error,
}));
