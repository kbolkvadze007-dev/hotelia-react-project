import { createContext, useContext } from "react";

const reviewCategories = [
  "ყველა შეფასება",
  "მდებარეობა",
  "სისუფთავე",
  "მომსახურება",
  "კომფორტი",
];

const ReviewCategoriesContext = createContext(null);

export function ReviewCategoriesProvider({ children }) {
  return (
    <ReviewCategoriesContext.Provider value={reviewCategories}>
      {children}
    </ReviewCategoriesContext.Provider>
  );
}

export function useReviewCategories() {
  const categories = useContext(ReviewCategoriesContext);
  if (!categories) {
    throw new Error("useReviewCategories must be used within ReviewCategoriesProvider");
  }
  return categories;
}
