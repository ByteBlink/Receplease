import { useStore } from "../../zustand/store";
import { toggleFavouritedBy } from "../../services/api-service";
import favouriteIconTrue from "../../assets/favourite-true-icon.svg";
import favouriteIconFalse from "../../assets/favourite-false-icon.svg";
import  { Recipe }  from "../../zustand/store"; 

function RecipeIngredients({ recipeDetail }: { recipeDetail: Recipe }) {
  // ZUSTAND:
  const userID = useStore((state) => state.userID);
  const updateOneRecipe = useStore((state) => state.updateOneRecipe);

  // FUNCTIONS:
  async function handleFavourite() {
    const res = await toggleFavouritedBy(recipeDetail._id, userID); 
    updateOneRecipe(res); 
  }

  // RENDER:
  if (recipeDetail._id) {
    return (
      <div className="recipe-container">
        <div className="recipe-img-container">
          <img
            src={recipeDetail.imageUrl}
            alt="Recipe photo"
            className="recipe-img"
          />
        </div>

        <div className="ingredients-details">
          <div className="favourite-ingredients">
            <img
              src={
                recipeDetail.favouritedBy.indexOf(userID) !== -1
                  ? favouriteIconTrue
                  : favouriteIconFalse
              }
              alt="Heart icon"
              className="favourite-icon"
              onClick={handleFavourite}
            />
            <h2>{recipeDetail.title}</h2>
          </div>

          <p>{recipeDetail.longDescription}</p>

          <h3>Ingredients</h3>
          {Array.isArray(recipeDetail.ingredients) &&
            recipeDetail.ingredients.map((ingredient: string, index :number) => (
              <div key={index}>
                <input type="checkbox" name={ingredient} className="checkbox" />
                <label htmlFor={ingredient}>{ingredient}</label>
              </div>
            ))}
        </div>
      </div>
    );
  }
}
export default RecipeIngredients;
