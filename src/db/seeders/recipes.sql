-- Reset autoincrement IDs for the recipe table
UPDATE sqlite_sequence SET seq = 0 WHERE name = 'recipe';

-- Reset autoincrement IDs for the recipe_ingredient table
UPDATE sqlite_sequence SET seq = 0 WHERE name = 'recipe_ingredient';

-- Reset autoincrement IDs for the recipe_step table
UPDATE sqlite_sequence SET seq = 0 WHERE name = 'recipe_step';

-- Insert recipes
INSERT INTO recipe (name, description) VALUES
('Spaghetti Carbonara', 'A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.'),
('Chicken Salad', 'A healthy salad with grilled chicken, mixed greens, and a light vinaigrette.'),
('Pancakes', 'Fluffy pancakes perfect for a weekend breakfast.');

-- Insert recipe ingredients
INSERT INTO recipe_ingredient (recipe_id, amount, unit, product_id) VALUES
(1, 200, 'g', 1),
(1, 100, 'g', 2),
(1, 2, 'pcs', 3),
(1, 50, 'g', 4),
(1, 1, 'tsp', 5),
(2, 200, 'g', 6),
(2, 100, 'g', 7),
(2, 50, 'ml', 8),
(3, 200, 'g', 9),
(3, 300, 'ml', 10),
(3, 2, 'pcs', 3),
(3, 1, 'tbsp', 11),
(3, 1, 'tsp', 12);

-- Insert recipe steps
INSERT INTO recipe_step (recipe_id, "order", description, name) VALUES
-- Spaghetti Carbonara steps
(1, 1, 'Cook the spaghetti according to the package instructions.', 'Cook Spaghetti'),
(1, 2, 'Fry the pancetta until crispy.', 'Fry Pancetta'),
(1, 3, 'Beat the eggs and mix with grated Parmesan cheese.', 'Prepare Sauce'),
(1, 4, 'Combine the spaghetti, pancetta, and egg mixture. Season with black pepper.', 'Combine Ingredients'),
-- Chicken Salad steps
(2, 1, 'Grill the chicken until fully cooked.', 'Grill Chicken'),
(2, 2, 'Mix the greens and vinaigrette in a bowl.', 'Prepare Salad'),
(2, 3, 'Slice the grilled chicken and add to the salad.', 'Add Chicken'),
-- Pancakes steps
(3, 1, 'Mix the flour, sugar, and baking powder in a bowl.', 'Mix Dry Ingredients'),
(3, 2, 'Whisk the eggs and milk together.', 'Mix Wet Ingredients'),
(3, 3, 'Combine the wet and dry ingredients to form a batter.', 'Combine Ingredients'),
(3, 4, 'Cook the pancakes on a hot griddle until golden brown.', 'Cook Pancakes');