
const url = 'http://127.0.0.1:8000/api-proxy/recipedb/recipe2-api/recipe/recipesinfo?page=1&limit=1';
console.log(`Fetching: ${url}`);

fetch(url)
    .then(res => {
        console.log(`Status: ${res.status}`);
        return res.text();
    })
    .then(text => console.log(`Body length: ${text.length}`))
    .catch(err => {
        console.error("Fetch failed:");
        console.error(err);
        if (err.cause) console.error("Cause:", err.cause);
    });
