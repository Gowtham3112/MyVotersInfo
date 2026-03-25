const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ---------------- SEARCH VOTERS ----------------
const searchVoters = async (req, res) => {
  try {

    let { type, query, search, page, limit } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const skip = (page - 1) * limit;

    let whereCondition = {};

    /* ===============================
       TYPE BASED SEARCH
    =============================== */

    if (type && query) {

      switch (type) {

        case "category":
          whereCondition.category = {
            name: { contains: query }
          };
          break;

        case "part_number":
          whereCondition.part = {
            name: { contains: query }
          };
          break;

        case "ward":
          whereCondition.ward = {
            wardNo: { contains: query }
          };
          break;

        case "area":
          whereCondition.area = {
            name: { contains: query }
          };
          break;

        case "voter_name":
          whereCondition.voterName = {
            contains: query
          };
          break;

        case "phone":
          whereCondition.phone = {
            contains: query
          };
          break;

        case "address":
          whereCondition.address = {
            contains: query
          };
          break;

        case "aadhar":
          whereCondition.aadharNumber = {
            contains: query
          };
          break;

        case "ration_card":
          whereCondition.rationCardNumber = {
            contains: query
          };
          break;

        case "voter_id":
          whereCondition.voterId = {
            contains: query
          };
          break;

        default:
          break;

      }

    }

    /* ===============================
       TABLE SEARCH
    =============================== */

    if (search) {

      whereCondition = {
        AND: [
          whereCondition,
          {
            OR: [
              { voterName: { contains: search } },
              { phone: { contains: search } },
              { voterId: { contains: search } },
              { address: { contains: search } },
              { aadharNumber: { contains: search } },
              { rationCardNumber: { contains: search } }
            ]
          }
        ]
      };

    }

    /* ===============================
       DATABASE QUERY
    =============================== */

    const [voters, total] = await Promise.all([

      prisma.voter.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        include: {
          category: true,
          part: true,
          ward: true,
          area: true
        },
        orderBy: {
          createdAt: "desc"
        }
      }),

      prisma.voter.count({
        where: whereCondition
      })

    ]);

    /* ===============================
       RESPONSE
    =============================== */

    res.status(200).json({

      data: voters,

      pagination: {
        totalRecords: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit)
      }

    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch voters",
      error: error.message
    });

  }
};

module.exports = {
  searchVoters
};