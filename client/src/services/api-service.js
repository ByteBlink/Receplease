const BASE_URL = "http://localhost:3000";

export async function register(user) {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return await res.json();
  } catch (error) {
    console.error(error);
  }
}

export async function login(user) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return await res.json();
  } catch (error) {
    console.error(error);
  }
}

export async function getRecipes(userID) {
  try {
    const res = await fetch(`${BASE_URL}/dashboard/${userID}`);
    return await res.json();
  } catch (error) {
    console.error(error);
  }
}

export async function toggleFavouritedBy(recipeId, userId) {
  try {
    const body = { recipeId, userId };
    const res = await fetch(`${BASE_URL}/favourite-recipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return await res.json();
  } catch (error) {
    console.error(error);
  }
}
