import Navbar from "../../components/navbar";
import AddAndSearchBar from "./add-and-search-bar";
import FilterButtons from "./filter-buttons";
import CategoryCarousel from "./category-carousel";
import CategoryWrapped from "./category-wrapped";
import { Recipe, useStore } from "../../zustand/store";
import { useState, useEffect, FC } from "react";
import { getRecipes } from "../../services/api-service";
import RecipeCard from "../../components/recipe-card";
import { StoreState } from "../../zustand/store";

interface ApiResponse {
  data: Recipe[];
}

const Dashboard: FC = () => {
  // STATES:
  const [query, setQuery] = useState<string>("");

  // ZUSTAND:
  const userID = useStore((state: StoreState) => state.userID);
  const allRecipes = useStore((state: StoreState) => state.recipes);
  const filteredCategory = useStore((state: StoreState) => state.filteredCategory);
  const { addRecipes } = useStore(); // Populates the Zustand recipes array

  // VARIABLES:
  const searchedRecipes = allRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(query.toLowerCase()),
  );

  // USE EFFECTS:
  // Get all recipes on load and update recipes array in the Zustand store:
  useEffect(() => {
    async function getRecipesArr(userID: string) {
      const res: ApiResponse = await getRecipes(userID);
      addRecipes(res.data);
    }
    getRecipesArr(userID);
  }, [addRecipes, userID]);

  // RENDER:
  return (
    <div className="dashboard-container">
      <Navbar />
      <AddAndSearchBar query={query} setQuery={setQuery} />
      <FilterButtons />
      {
        // All Recipes button selected:
        allRecipes.length > 0 &&
        query.length === 0 &&
        filteredCategory === "All Recipes" ? (
          <>
            <CategoryCarousel categoryTitle="Starters" />
            <CategoryCarousel categoryTitle="Mains" />
            <CategoryCarousel categoryTitle="Sides" />
            <CategoryCarousel categoryTitle="Desserts" />
            <CategoryCarousel categoryTitle="Bakery" />
            <CategoryCarousel categoryTitle="Drinks" />
          </>
        ) : (
          query.length === 0 &&
          filteredCategory === "All Recipes" && (
            <h2>You have no recipes. Get cooking!</h2>
          )
        )
      }

      {
        // Specific category button selected:
        query.length === 0 && filteredCategory !== "All Recipes" && (
          <CategoryWrapped categoryTitle={`${filteredCategory}`} />
        )
      }

      {
        // Search results:
        query.length > 0 ? (
          <div className="category-wrapped-container">
            {searchedRecipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
            ))}
          </div>
        ) : (
          ""
        )
      }
    </div>
  );
}

export default Dashboard;
