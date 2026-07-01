import {Category} from "@/store/slices/categories/interface";

/**
 * Get child categories from flat array by parent ID
 * @param categories - Flat array of all categories
 * @param parentId - Parent category ID to filter by
 * @returns Array of child categories
 */
export const getChildCategoriesByParentId = (categories: Category[], parentId: string | null): Category[] => {
  if (!parentId) return [];
  return categories.filter((cat) => cat.parentId === parentId);
};

/**
 * Get all root categories (no parent)
 * @param categories - Flat array of all categories
 * @returns Array of root categories
 */
export const getRootCategories = (categories: Category[]): Category[] => {
  return categories.filter((cat) => !cat.parentId);
};

/**
 * Builds a hierarchical tree structure from a flat list of categories
 * @param categories - Flat list of categories with parentId field
 * @returns Hierarchical tree structure with root categories at top level
 */
export const buildCategoryTree = (categories: Category[]): Category[] => {
  if (!categories || categories.length === 0) return [];

  // Create a map for quick lookup
  const categoryMap = new Map<string, Category>();
  const rootCategories: Category[] = [];

  // First pass: initialize all categories
  categories.forEach((cat) => {
    categoryMap.set(cat.id, {
      ...cat,
      child: [],
    });
  });

  // Second pass: build parent-child relationships
  categories.forEach((cat) => {
    if (!cat.parentId) {
      // Root category
      rootCategories.push(categoryMap.get(cat.id)!);
    } else {
      // Child category
      const parent = categoryMap.get(cat.parentId);
      if (parent) {
        parent.child ??= [];
        parent.child.push(categoryMap.get(cat.id)!);
      }
    }
  });

  // Sort each level by autoNumber
  const sortCategories = (cats: Category[]): void => {
    cats.sort((a, b) => {
      const aNum = a.autoNumber ?? 0;
      const bNum = b.autoNumber ?? 0;
      return aNum - bNum;
    });
    cats.forEach((cat) => {
      if (cat.child && cat.child.length > 0) {
        sortCategories(cat.child);
      }
    });
  };

  sortCategories(rootCategories);

  return rootCategories;
};

/**
 * Finds parent chain for a given slug from hierarchical tree
 * @param categories - Hierarchical tree of categories
 * @param slug - Target slug to find parent chain for
 * @returns Array of categories from root to target
 */
export const findParentChain = (categories: Category[], slug: string | null): Category[] => {
  if (!slug) return [];

  for (const category of categories) {
    if (category.slug === slug) return [category];
    if (category.child && category.child.length > 0) {
      const childMatch = findParentChain(category.child, slug);
      if (childMatch.length > 0) return [category, ...childMatch];
    }
  }

  return [];
};

/**
 * Find a category by ID from hierarchical tree
 * @param categories - Hierarchical tree of categories
 * @param id - Category ID to search for
 * @returns Category object or null
 */
export const findCategoryById = (categories: Category[], id: string): Category | null => {
  for (const category of categories) {
    if (category.id === id) return category;
    if (category.child && category.child.length > 0) {
      const found = findCategoryById(category.child, id);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Find a category by slug from hierarchical tree
 * @param categories - Hierarchical tree of categories
 * @param slug - Category slug to search for
 * @returns Category object or null
 */
export const findCategoryBySlug = (categories: Category[], slug: string): Category | null => {
  for (const category of categories) {
    if (category.slug === slug) return category;
    if (category.child && category.child.length > 0) {
      const found = findCategoryBySlug(category.child, slug);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Flatten hierarchical category tree to a flat array
 * @param categories - Hierarchical tree of categories
 * @returns Flat array of all categories
 */
export const flattenCategories = (categories: Category[]): Category[] => {
  const result: Category[] = [];

  const flatten = (cats: Category[]): void => {
    cats.forEach((cat) => {
      const {child, ...catWithoutChild} = cat;
      result.push(catWithoutChild);
      if (child && child.length > 0) {
        flatten(child);
      }
    });
  };

  flatten(categories);
  return result;
};

/**
 * Get all children of a category (including nested)
 * @param category - Category to get children from
 * @returns Array of all child categories
 */
export const getAllChildren = (category: Category | undefined): Category[] => {
  if (!category || !category.child) return [];

  const result: Category[] = [...category.child];

  category.child.forEach((child) => {
    result.push(...getAllChildren(child));
  });

  return result;
};

/**
 * Get immediate children only
 * @param category - Category to get children from
 * @returns Array of immediate child categories
 */
export const getImmediateChildren = (category: Category | undefined): Category[] => {
  return category?.child ?? [];
};

/**
 * Check if a category is active and all parents are active
 * @param category - Category to check
 * @param allCategories - All categories (flat list)
 * @returns Boolean indicating if category chain is active
 */
export const isCategoryChainActive = (category: Category, allCategories: Category[]): boolean => {
  if (category.isActive === false) return false;

  let current = category;
  while (current.parentId) {
    const parent = allCategories.find((cat) => cat.id === current.parentId);
    if (!parent || parent.isActive === false) return false;
    current = parent;
  }

  return true;
};

/**
 * Get category breadcrumb path
 * @param slug - Category slug
 * @param categories - Hierarchical tree of categories
 * @returns Array of category names from root to target
 */
export const getCategoryBreadcrumb = (slug: string, categories: Category[]): string[] => {
  const chain = findParentChain(categories, slug);
  return chain.map((cat) => cat.name);
};
