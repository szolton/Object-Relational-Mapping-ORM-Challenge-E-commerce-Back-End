const router = require('express').Router();
const { Category, Product } = require('../../models');

// Get all categories and their associated products
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product }]
    });
    res.status(200).json(categories);
  } catch (err) {
    console.error(err); // Add logging
    res.status(500).json({ message: 'Failed to retrieve categories' });
  }
});

// Get a single category and its associated products by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product }]
    });

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json(category);
  } catch (err) {
    console.error(err); // Add logging
    res.status(500).json({ message: 'Failed to retrieve category' });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err) {
    console.error(err); // Add logging
    res.status(400).json({ message: 'Failed to create category' });
  }
});

// Update a category by ID
router.put('/:id', async (req, res) => {
  try {
    const [updatedRows] = await Category.update(req.body, {
      where: { id: req.params.id }
    });

    if (updatedRows === 0) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    const updatedCategory = await Category.findByPk(req.params.id);
    res.status(200).json(updatedCategory);
  } catch (err) {
    console.error(err); // Add logging
    res.status(500).json({ message: 'Failed to update category' });
  }
});

// Delete a category by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Category.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json({ message: 'Category deleted' });
  } catch (err) {
    console.error(err); // Add logging
    res.status(500).json({ message: 'Failed to delete category' });
  }
});

module.exports = router;
