const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ---------------- GET ALL CATEGORIES ----------------
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// ---------------- CREATE CATEGORY ----------------
const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await prisma.category.create({
      data: { name, description },
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// ---------------- UPDATE CATEGORY ----------------
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check if another category with the same name exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        NOT: { id: Number(id) },
      },
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: { name, description },
    });

    res.status(200).json({
      message: "Category updated successfully",
      updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// ---------------- DELETE CATEGORY ----------------
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.category.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};