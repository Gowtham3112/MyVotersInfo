const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ---------------- GET ALL AREAS ----------------
const getAllAreas = async (req, res) => {
  try {
    const areas = await prisma.area.findMany({
      include: { category: true, part: true, ward: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(areas);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch areas", error: error.message });
  }
};

// ---------------- GET AREAS WITH PAGINATION ----------------
const getAreasPaginated = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const whereCondition = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
            { ward: { wardNo: { contains: search } } },
            { part: { name: { contains: search } } },
            { category: { name: { contains: search } } },
          ],
        }
      : {};

    const [areas, total] = await Promise.all([
      prisma.area.findMany({
        where: whereCondition,
        include: { category: true, part: true, ward: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.area.count({ where: whereCondition }),
    ]);

    res.status(200).json({
      data: areas,
      pagination: { totalRecords: total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch areas", error: error.message });
  }
};

// ---------------- GET AREAS BY FILTERS ----------------
const getAreasByFilters = async (req, res) => {
  const { categoryId, partId, wardId } = req.query;
  try {
    const whereCondition = {};
    if (categoryId) whereCondition.categoryId = Number(categoryId);
    if (partId) whereCondition.partId = Number(partId);
    if (wardId) whereCondition.wardId = Number(wardId);

    const areas = await prisma.area.findMany({
      where: whereCondition,
      include: { category: true, part: true, ward: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(areas);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch areas", error: error.message });
  }
};

// ---------------- CREATE AREA ----------------
const createArea = async (req, res) => {
  const { name, description, categoryId, partId, wardId } = req.body;

  try {
    if (!name || !categoryId || !partId || !wardId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingArea = await prisma.area.findFirst({ where: { name } });
    if (existingArea) return res.status(400).json({ message: "Area name already exists" });

    const area = await prisma.area.create({
      data: { name, description, categoryId, partId, wardId },
      include: { category: true, part: true, ward: true },
    });

    res.status(201).json({ message: "Area created successfully", area });
  } catch (error) {
    res.status(500).json({ message: "Failed to create area", error: error.message });
  }
};

// ---------------- UPDATE AREA ----------------
const updateArea = async (req, res) => {
  const { id } = req.params;
  const { name, description, categoryId, partId, wardId } = req.body;

  try {
    const existingArea = await prisma.area.findFirst({
      where: { name, NOT: { id: Number(id) } },
    });
    if (existingArea) return res.status(400).json({ message: "Area name already exists" });

    const area = await prisma.area.update({
      where: { id: Number(id) },
      data: { name, description, categoryId, partId, wardId },
      include: { category: true, part: true, ward: true },
    });

    res.status(200).json({ message: "Area updated successfully", area });
  } catch (error) {
    res.status(500).json({ message: "Failed to update area", error: error.message });
  }
};

// ---------------- DELETE AREA ----------------
const deleteArea = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.area.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Area deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete area", error: error.message });
  }
};

module.exports = {
  getAllAreas,
  getAreasPaginated,
  getAreasByFilters,
  createArea,
  updateArea,
  deleteArea,
};