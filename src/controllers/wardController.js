const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ---------------- GET ALL WARDS ----------------
const getAllWards = async (req, res) => {
  try {
    const wards = await prisma.ward.findMany({
      include: {
        category: true,
        part: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(wards);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch wards",
      error: error.message,
    });
  }
};

// ---------------- GET WARDS PAGINATION ----------------
const getWards = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const whereCondition = search
      ? {
          OR: [
            {
              wardNo: {
                contains: search,
              },
            },
            {
              description: {
                contains: search,
              },
            },
            {
              category: {
                name: {
                  contains: search,
                },
              },
            },
            {
              part: {
                name: {
                  contains: search,
                },
              },
            },
          ],
        }
      : {};

    const [wards, total] = await Promise.all([
      prisma.ward.findMany({
        where: whereCondition,
        include: {
          category: true,
          part: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),

      prisma.ward.count({
        where: whereCondition,
      }),
    ]);

    res.status(200).json({
      data: wards,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch wards",
      error: error.message,
    });
  }
};

// ---------------- CATEGORY BASED WARDS ----------------
const getWardsByCategory = async (req, res) => {
  const { categoryId, partId } = req.query;

  if (!categoryId || !partId) {
    return res.status(400).json({
      message: "Both categoryId and partId are required",
    });
  }

  try {
    const wards = await prisma.ward.findMany({
      where: {
        categoryId: Number(categoryId),
        partId: Number(partId),
      },
      include: {
        category: true,
        part: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(wards);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch wards by category and part",
      error: error.message,
    });
  }
};
// ---------------- CREATE WARD ----------------
const createWard = async (req, res) => {
  const { wardNo, description, categoryId, partId } = req.body;

  try {
    if (!wardNo || !categoryId || !partId) {
      return res.status(400).json({
        message: "Ward No, Category and Part are required",
      });
    }

    // Check if wardNo already exists for the same category & part
    const existingWard = await prisma.ward.findFirst({
      where: {
        wardNo,
        categoryId: Number(categoryId),
        partId: Number(partId),
      },
    });

    if (existingWard) {
      return res.status(400).json({
        message: "Ward No already exists for this Category and Part",
      });
    }

    const ward = await prisma.ward.create({
      data: {
        wardNo,
        description,
        categoryId: Number(categoryId),
        partId: Number(partId),
      },
    });

    res.status(201).json({
      message: "Ward created successfully",
      ward,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create ward",
      error: error.message,
    });
  }
};

// ---------------- UPDATE WARD ----------------
const updateWard = async (req, res) => {
  const { id } = req.params;
  const { wardNo, description, categoryId, partId } = req.body;

  try {
    // Check if another ward with same wardNo exists for same category & part
    const existingWard = await prisma.ward.findFirst({
      where: {
        wardNo,
        categoryId: Number(categoryId),
        partId: Number(partId),
        NOT: { id: Number(id) },
      },
    });

    if (existingWard) {
      return res.status(400).json({
        message: "Ward No already exists for this Category and Part",
      });
    }

    const ward = await prisma.ward.update({
      where: { id: Number(id) },
      data: {
        wardNo,
        description,
        categoryId: Number(categoryId),
        partId: Number(partId),
      },
    });

    res.status(200).json({
      message: "Ward updated successfully",
      ward,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update ward",
      error: error.message,
    });
  }
};

// ---------------- DELETE WARD ----------------
const deleteWard = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.ward.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      message: "Ward deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete ward",
      error: error.message,
    });
  }
};

module.exports = {
  getAllWards,
  getWards,
  getWardsByCategory,
  createWard,
  updateWard,
  deleteWard,
};
