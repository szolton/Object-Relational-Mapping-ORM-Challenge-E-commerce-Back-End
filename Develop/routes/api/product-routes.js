const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// Get all of the products
router.get('/', (req, res) => {

  // Find all of the  products

  // Include it's category and tag data
  Product.findAll({
    include: [
      {
        model: Category,
        attributes: ['id', 'category_name']
      },
      {
        model: Tag,
        as: 'tags', // Update the alias to match the association alias
        through: ProductTag,
        attributes: ['id', 'tag_name']
      }
    ]
  })
    .then((products) => res.status(200).json(products))
    .catch((err) => {
      console.error(err); // Log the error message to the console
      res.status(500).json(err); // Return a 500 status with the error message
    });
});

// Get just one product
router.get('/:id', (req, res) => {

  // Find a single product by it's `id`
  // Include it's Category and Tag data
  Product.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Category,
        attributes: ['id', 'category_name']
      },
      {
        model: Tag,
        as: 'tags', // Update the alias to match the association alias
        through: ProductTag,
        attributes: ['id', 'tag_name']
      }
    ]
  })
    .then((product) => {
      if (!product) {
        res.status(404).json({ message: 'No product found with this id' });
        return;
      }
      res.status(200).json(product);
    })
    .catch((err) => {
      console.error(err); // Log the error message to the console
      res.status(500).json(err); // Return a 500 status with the error message
    });
});

// Create a new product
router.post('/', (req, res) => {
 
  Product.create(req.body)
    .then((product) => {

      // If there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // If no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.error(err); // Log the error message to the console
      res.status(400).json(err); // Return a 400 status with the error message
    });
});

// Update the product
router.put('/:id', (req, res) => {

  // Update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {

          // Create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // Decide which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);

          // Run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      console.error(err); // Log the error message to the console
      res.status(400).json(err); // Return a 400 status with the error message
    });
});

// Delete one product by its `id`
router.delete('/:id', (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id
    }
  })
    .then((product) => {
      if (!product) {
        res.status(404).json({ message: 'No product found with this id' });
        return;
      }
      res.status(200).json({ message: 'Product deleted successfully' });
    })
    .catch((err) => {
      console.error(err); // Log the error message to the console
      res.status(500).json(err); // Return a 500 status with the error message
    });
});

module.exports = router;
