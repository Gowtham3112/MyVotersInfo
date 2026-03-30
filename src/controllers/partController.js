const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ---------------- GET ALL PARTS (NO PAGINATION) ----------------
const getAllParts = async (req, res) => {
  try {
    const parts = await prisma.part.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(parts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch parts",
      error: error.message,
    });
  }
};

// ---------------- GET PARTS (PAGINATION + SEARCH) ----------------
const getParts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", sortBy = "createdAt", order = "desc" } = req.query;

    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const whereCondition = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
            {
              category: {
                name: { contains: search },
              },
            },
          ],
        }
      : {};

    const [parts, total] = await Promise.all([
      prisma.part.findMany({
        where: whereCondition,
        include: { category: true },
        orderBy: {
          [sortBy]: order, // 🔥 dynamic sorting
        },
        skip,
        take: limit,
      }),
      prisma.part.count({ where: whereCondition }),
    ]);

    res.status(200).json({
      data: parts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch parts",
      error: error.message,
    });
  }
};

// ---------------- CREATE PART ----------------
const createPart = async (req, res) => {
  const { name, description, categoryId } = req.body;

  try {
    if (!name || !categoryId) {
      return res.status(400).json({
        message: "Part No and Category are required",
      });
    }

    // Check if part with same name exists in the category
    const existingPart = await prisma.part.findFirst({
      where: {
        name,
        categoryId: Number(categoryId),
      },
    });

    if (existingPart) {
      return res.status(400).json({
        message: "Part No already exists in this category",
      });
    }

    const part = await prisma.part.create({
      data: {
        name,
        description,
        categoryId: Number(categoryId),
      },
    });

    res.status(201).json({
      message: "Part created successfully",
      part,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create part",
      error: error.message,
    });
  }
};

// ---------------- UPDATE PART ----------------
const updatePart = async (req, res) => {
  const { id } = req.params;
  const { name, description, categoryId } = req.body;

  try {
    // Check if another part with same name exists in the category
    const existingPart = await prisma.part.findFirst({
      where: {
        name,
        categoryId: Number(categoryId),
        NOT: { id: Number(id) },
      },
    });

    if (existingPart) {
      return res.status(400).json({
        message: "Part No already exists in this category",
      });
    }

    const updatedPart = await prisma.part.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        categoryId: Number(categoryId),
      },
    });

    res.status(200).json({
      message: "Part updated successfully",
      updatedPart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update part",
      error: error.message,
    });
  }
};

// ---------------- DELETE PART ----------------
const deletePart = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.part.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      message: "Part deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete part",
      error: error.message,
    });
  }
};

// ---------------- GET PARTS BY CATEGORY ----------------
const getPartsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const parts = await prisma.part.findMany({
      where: {
        categoryId: Number(categoryId),
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(parts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch parts by category",
      error: error.message,
    });
  }
};

module.exports = {
  getAllParts,
  getParts,
  createPart,
  updatePart,
  deletePart,
  getPartsByCategory
};
