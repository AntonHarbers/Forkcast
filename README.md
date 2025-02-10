# Forkcast

## Todos:

### Functionality:

[✔] CRUD Shop-Data and UI
[✔] Tabs for different shops
[✔] Set up dummy shop data
[✔] CRUD Ingredient Blueprints
[✔] Reset forms on submit
[✔] Set up context for global data (stores, ingredients, meals etc.)
[✔] Edit Ingredient Blueprint Form
[✔] Delete Ingredient Blueprint
[✔] Basic Display of Ingredient data
[✔] Set up dummy Ingredient data
[✔] Show ingredients as options in making a meal
[✔] Ingredient Blueprint measurement units crud
[✔] Ingredient Blueprint Store crud
[✔] Searchable selection box for new meal ingredients
[✔] adjustable new meal ingredient amounts
[✔] basic meal data Styling
[✔] checkmark to set meal as "done"
[✔] shopping list should not show done or past Ingredients
[✔] Update/Delete Meal Data
[✔] Set up dummy Meal Data
[✔] Deal with meal order (meal order defaults to last one, can be moved accordingly)
[✔] when opening shop tab:
[✔] Ingredients that have been added to the meals should appear in shopping list (with their appropriate amounts), summed up in a way where multiple meal ingredients are added together amount wise
[✔] Checkbox to toggle bought/not bought
[✔] CRUD FOR UNIT TYPES?
[✔] Sort the ingredients by area in shop (CRUD FOR AREA?)
[✔] reducer for global state
[✔] Rework data to be soft deleted instead of hard (isDeleted flag with deletedAt timestamp, deleted items no longer show up or should be pulled from api) / put this in our reducer
[✔] Soft Delete - Categories
[✔] Soft Delete - IngredientBlueprints
[✔] Soft Delete - Shops
[✔] Soft Delete - Meals
[✔] Soft Delete - Units
[✔] Check why changing category and meal order has no effect
[✔] make sure not to mutate date but to duplicate it with ... operator wherever needed
[✔] useMemo implementation on anything that requires heavy compute
[in progress] refactor everything
[✔] when deleting a category, the ingredients belonging to that category should be listed under not categorized
[✔] when deleting a store, ingredients with the deleted store should show up in default until reassigned
[✔] dont allow 0 as amount inputs
[✔] make sure that you cannot add the same ingredientblueprint to the same meal more than one time
[✔] Move all types into types.ts
[✔] turn classes into typed objects instead
[✔] Comportmentalize the app
[] copy meals
[] move meals to different day
[] dummy api calls, optimistic updates and loading states

### Styling:

[] Calendar
[] Daily View - Meal Planning
[] Shopping List Page
[] Ingredients Page

### Later:

[] Set up database connection to postgres using drizzle
[] User Data/Accounts with clerk
[] Backend API with Express

MAYBE Secion
[] virtualize data (react-window for frontend only rendering portion of data)
[] virtualize data (paginate the api responses to only get a certain amount of data at a time when needed)

## Notes:
