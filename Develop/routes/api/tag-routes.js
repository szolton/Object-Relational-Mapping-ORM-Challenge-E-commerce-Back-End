const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// Get all tags, including associated products
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [
        {
          model: Product,
          as: 'products',
          through: { attributes: [] }, // Exclude ProductTag attributes
        },
      ],
    });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a single tag by its `id`, including associated products
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: 'products',
          through: { attributes: [] }, // Exclude ProductTag attributes
        },
      ],
    });

    if (!tag) {
      res.status(404).json({ message: 'No tag found with this id' });
      return;
    }

    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new tag
router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a tag's name by its `id`
router.put('/:id', async (req, res) => {
  try {
    const [updatedRows] = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!updatedRows) {
      res.status(404).json({ message: 'No tag found with this id' });
      return;
    }

    res.status(200).json(updatedRows);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a tag by its `id`
router.delete('/:id', async (req, res) => {
  try {
    const deletedRows = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedRows) {
      res.status(404).json({ message: 'No tag found with this id' });
      return;
    }

    res.status(200).json(deletedRows);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
