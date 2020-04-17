const API_ID = "e9f183a4"
const APP_KEY = "4b85992501df96dcd34fbde8e890564b"

export function fetchRecipes (food = '') {
  console.log(API_ID);
  food = food.trim()

  return fetch(`https://api.edamam.com/search?q=${food}&app_id=${API_ID}&app_key=${APP_KEY}`)
    .then((res) => res.json())
    .then(({ hits }) => hits.map(({ recipe }) => recipe))
}