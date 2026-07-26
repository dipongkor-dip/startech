"use client";
import {useAppSelector} from "@/store/hooks";
import {selectFlatCategories} from "@/store/slices/categories/selectors";

const CategoriesLay = () => {
  const flatCategories = useAppSelector(selectFlatCategories);
  console.log(flatCategories);

  return (
    <div>
      <h2>Categories</h2>
    </div>
  );
};

export default CategoriesLay;
