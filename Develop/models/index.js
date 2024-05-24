// Import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Define relationships between models

// A Product belongs to a Category
Product.belongsTo(Category, {
  foreignKey: 'category_id', // The foreign key in the Product model
  onDelete: 'CASCADE', // Ensure that deleting a category will delete associated products
});

// A Product belongs to many Tags through the ProductTag model
Product.belongsToMany(Tag, {
  through: ProductTag, // The intermediate model
  foreignKey: 'product_id', // The foreign key in the Product model
  as: 'tags' // Alias to use in eager loading
});

// A Tag belongs to many Products through the ProductTag model
Tag.belongsToMany(Product, {
  through: ProductTag, // The intermediate model
  foreignKey: 'tag_id', // The foreign key in the Tag model
  as: 'products' // Alias to use in eager loading
});

// A Category has many Products
Category.hasMany(Product, {
  foreignKey: 'category_id', // The foreign key in the Product model
  onDelete: 'CASCADE', // Ensure that deleting a category will delete associated products
});

// Export models
module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
