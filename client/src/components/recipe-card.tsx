import React from "react";
import { useStore, Recipe } from "../zustand/store";
import { toggleFavouritedBy, deleteRecipe } from "../services/api-service";
import favouriteIconTrue from "../assets/favourite-true-icon.svg";
import favouriteIconFalse from "../assets/favourite-false-icon.svg";
import deleteIcon from "../assets/delete-icon.svg";
import { useNavigate } from "react-router-dom";

//Define RecipeCardProp
interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({recipe}) => {
  // VARIABLES:
  const userID = useStore((state) => state.userID);
  const recipes = useStore((state) => state.recipes);
  const { updateFilteredCategory, updateOneRecipe, removeOneRecipe } =
    useStore();
  const favouriteRecipes = recipes.filter(
    (recipe) => recipe.favouritedBy.indexOf(userID) !== -1,
  );
  const navigate = useNavigate();

  // FUNCTIONS:
  async function handleFavourite() {
    const res = await toggleFavouritedBy(recipe._id, userID); 
    updateOneRecipe(res); 
  }

  async function handleDelete(userId: string, recipeId: string) {
    await deleteRecipe(userId, recipeId);
    removeOneRecipe(recipeId); 
  }

  // RENDER:
  return (
    <div className="recipe-card">
      <img
        src={recipe.imageUrl}
        alt="Recipe Photo"
        className="recipe-card-img"
        onClick={() => {
          navigate(`/recipe-detail/${recipe._id}`);
          updateFilteredCategory("All Recipes"); 
        }}
      />
      <div className="recipe-details">
        <div className="recipe-title-desc">
          <h3>{recipe.title}</h3>
          <p>{recipe.shortDescription}</p>
        </div>
        <div className="favourite-delete-icons">
          <img
            src={
              favouriteRecipes &&
              favouriteRecipes.find((favRecipe) => favRecipe._id === recipe._id)
                ? favouriteIconTrue
                : favouriteIconFalse
            }
            alt="Heart icon"
            onClick={handleFavourite}
            className="favourite-icon"
          />
          <img
            src={deleteIcon}
            alt="Delete Icon"
            onClick={() => handleDelete(userID, recipe._id)}
            className="delete-icon"
          />
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
