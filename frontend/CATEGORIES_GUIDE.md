# Categories System - Frontend Implementation Guide

## Overview
The categories system is now fully refactored with professional-grade code organization, error handling, and performance optimization.

## Architecture

### State Management (Redux)
- **Slice**: `src/store/slices/categories/categoriesSlice.ts`
  - Manages hierarchical tree and flat categories
  - Caching with 5-minute TTL
  - Automatic cache invalidation

- **State Structure**:
  ```typescript
  {
    categories: Category[], // Hierarchical tree for UI
    flatCategories: Category[], // Flat array for searches
    loading: boolean,
    error: string | null,
    lastFetched?: number,
  }
  ```

### API Layer (`src/store/slices/categories/api.ts`)
- Enhanced with:
  - Request timeout (10s)
  - Abort signal support
  - Comprehensive error handling
  - Response validation
  - Environment-based URL configuration

### Utilities (`src/lib/category-utils.ts`)
Rich set of utility functions:
- `buildCategoryTree()` - Convert flat to hierarchical
- `findCategoryBySlug()` - Find by slug
- `findCategoryById()` - Find by ID
- `findParentChain()` - Get breadcrumb path
- `flattenCategories()` - Convert tree to flat
- `getAllChildren()` - Get nested children
- `isCategoryChainActive()` - Check activation chain
- `getCategoryBreadcrumb()` - Get readable path

## Usage Examples

### 1. Using Custom Hooks (Recommended)

#### Basic Usage with Automatic Fetching
```tsx
import { useCategoriesWithFetch } from '@/hooks/useCategory';

export function MyComponent() {
  const { categories, loading, error, refetch } = useCategoriesWithFetch();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {categories.map(cat => (
        <div key={cat.id}>{cat.name}</div>
      ))}
    </div>
  );
}
```

#### Search and Navigation
```tsx
import { useCategorySearch } from '@/hooks/useCategory';

export function CategoryFinder() {
  const { findBySlug, getParentChain, getBreadcrumb } = useCategorySearch();

  const category = findBySlug('electronics');
  const breadcrumb = getBreadcrumb('electronics');
  const chain = getParentChain('electronics');

  return (
    <div>
      <h2>{category?.name}</h2>
      <p>Path: {breadcrumb.join(' > ')}</p>
    </div>
  );
}
```

#### Tree Operations
```tsx
import { useCategoryTree } from '@/hooks/useCategory';

export function TreeOperations() {
  const { hasChildren, getDepth } = useCategoryTree();

  return (
    <div>
      {/* Check if has children */}
      {hasChildren(category) && <SubMenu category={category} />}
    </div>
  );
}
```

### 2. Using Redux Selectors

```tsx
import { useAppSelector } from '@/store/hooks';
import { selectRootCategories, selectActiveCategories } from '@/store/slices/categories/selectors';

export function CategoryMenu() {
  const rootCategories = useAppSelector(selectRootCategories);
  const activeCategories = useAppSelector(selectActiveCategories);

  return <menu>{/* render */}</menu>;
}
```

### 3. Using State Directly

```tsx
import { useAppSelector } from '@/store/hooks';

export function Component() {
  const { categories, loading, error } = useAppSelector(state => state.categories);

  // Use categories...
}
```

## Performance Features

### 1. Caching
- 5-minute TTL automatically managed
- Prevents unnecessary API calls
- `lastFetched` timestamp tracking

### 2. Memoization
- Redux selectors use `createSelector`
- Prevents unnecessary re-renders
- Efficient tree building

### 3. Flat Categories Storage
- Maintains both tree and flat structure
- O(1) lookups for flat searches
- Tree structure for UI rendering

### 4. Request Optimization
- Abort signal support
- 10-second timeout
- Response validation

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_PRODUCT_API_URL=http://localhost:5004/api/v1
```

### Cache Duration
Edit in `config/category.config.ts`:
```typescript
export const CATEGORY_CACHE_CONFIG = {
  DURATION: 5 * 60 * 1000, // Adjust as needed
};
```

## Error Handling

Comprehensive error handling at multiple levels:

1. **API Level**: Request timeout, network errors, validation
2. **Redux Level**: Rejected thunks captured in state
3. **Component Level**: Use error state from hooks

```tsx
const { categories, error, refetch } = useCategoriesWithFetch();

if (error) {
  return (
    <div>
      <p>Error: {error}</p>
      <button onClick={refetch}>Retry</button>
    </div>
  );
}
```

## Migration Guide

### From Old Usage to New

**Old way:**
```tsx
useAppSelector(state => state.categories.categories)
```

**New way (with hooks):**
```tsx
const { categories } = useCategoriesWithFetch();
```

**New way (with selectors):**
```tsx
const categories = useAppSelector(selectRootCategories);
```

## Types

All TypeScript types are properly defined:
- `Category` - Individual category
- `CategoryState` - Redux state shape
- `CategoryResponse` - API response format

## Testing

Common test scenarios:

```typescript
// Test tree building
const flat = [/* categories */];
const tree = buildCategoryTree(flat);
expect(tree).toBeDefined();

// Test search
const found = findCategoryBySlug(tree, 'electronics');
expect(found?.id).toBe('123');

// Test breadcrumb
const breadcrumb = getCategoryBreadcrumb('nested-cat', tree);
expect(breadcrumb).toHaveLength(3);
```

## Best Practices

1. **Always use hooks** in components for automatic cache management
2. **Use selectors** for derived state
3. **Keep flat categories** for searches, use tree for navigation
4. **Handle loading/error states** from hooks
5. **Avoid direct Redux dispatch** - use hooks instead
6. **Cache invalidation** handled automatically

## Components Updated to Use New System

- `CategoryMegaMenu.tsx` - Category navigation
- `MobileSidebar.tsx` - Mobile menu
- `Path.tsx` - Breadcrumb paths
- `RootProductsPages.tsx` - Product listing

All components work seamlessly with the new professional category system!
