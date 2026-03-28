const { PrismaClient } = require("@prisma/client");
const ExcelJS = require("exceljs");

const PDFDocument = require("pdfkit");
require("jspdf-autotable");
const prisma = new PrismaClient();

const axios = require("axios");
const fs = require("fs");
const path = require("path");

// ---------------- VALIDATION ----------------

const validateNumbers = (data) => {
  if (data.aadharNumber && data.aadharNumber.length !== 12)
    return "Aadhar must be 12 digits";

  if (data.voterId && data.voterId.length < 6) return "Invalid voter id";

  if (data.rationCardNumber && data.rationCardNumber.length < 6)
    return "Invalid ration card number";

  return null;
};

// ---------------- CREATE VOTER ----------------

const createVoter = async (req, res) => {
  try {
    const data = req.body;

    const validationError = validateNumbers(data);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    let photoUrl = null;

    if (req.file) {
      const protocol = req.protocol;
      const host = req.get("host");
      photoUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    const voter = await prisma.voter.create({
      data: {
        categoryId: Number(data.category),
        partId: Number(data.partNo),
        wardId: Number(data.wardNo),
        areaId: Number(data.areaName),

        voterName: data.voterName,
        rollNo: data.rollNo,

        gender: data.gender,
        age: Number(data.age),
        address: data.address,

        phone: data.phone,

        aadharNumber: data.aadharNumber,
        voterId: data.voterId,
        rationCardNumber: data.rationCardNumber,

        rentalHouse: data.rentalHouse,
        houseOwnerName: data.houseOwnerName || null,
        houseOwnerContact: data.houseOwnerContact || null,

        occupation: data.occupation,
        govtScheme: data.govtScheme,
        party: data.party,

        photo: photoUrl,
      },
    });

    res.status(201).json({
      message: "Voter created successfully",
      voter,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        message: "Duplicate data detected",
      });
    }

    res.status(500).json({
      message: "Failed to create voter",
      error: error.message,
    });
  }
};

// ---------------- UPDATE VOTER ----------------

const updateVoter = async (req, res) => {
  const { id } = req.params;

  try {
    const data = req.body;

    let photoUrl = data.photo;

    if (req.file) {
      const protocol = req.protocol;
      const host = req.get("host");
      photoUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    const voter = await prisma.voter.update({
      where: { id: Number(id) },
      data: {
        categoryId: Number(data.category),
        partId: Number(data.partNo),
        wardId: Number(data.wardNo),
        areaId: Number(data.areaName),

        voterName: data.voterName,
        rollNo: data.rollNo,

        gender: data.gender,
        age: Number(data.age),
        address: data.address,

        phone: data.phone,

        aadharNumber: data.aadharNumber,
        voterId: data.voterId,
        rationCardNumber: data.rationCardNumber,

        rentalHouse: data.rentalHouse,
        houseOwnerName: data.houseOwnerName || null,
        houseOwnerContact: data.houseOwnerContact || null,

        occupation: data.occupation,
        govtScheme: data.govtScheme,
        party: data.party,

        photo: photoUrl,
      },
    });

    res.json({
      message: "Voter updated successfully",
      voter,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update voter",
      error: error.message,
    });
  }
};

// ---------------- DELETE VOTER ----------------

const deleteVoter = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.voter.delete({
      where: { id: Number(id) },
    });

    res.json({
      message: "Voter deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete voter",
      error: error.message,
    });
  }
};

// ---------------- GET ALL VOTERS ----------------

const getAllVoters = async (req, res) => {
  try {
    const voters = await prisma.voter.findMany({
      include: {
        category: true,
        part: true,
        ward: true,
        area: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(voters);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch voters",
      error: error.message,
    });
  }
};

// ---------------- PAGINATED VOTERS ----------------

const getVotersPaginated = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const whereCondition = search
      ? {
          OR: [
            { voterName: { contains: search } },
            { rollNo: { contains: search } },
            { phone: { contains: search } },
            { gender: { contains: search } },
            { address: { contains: search } },
            { aadharNumber: { contains: search } },
            { voterId: { contains: search } },
            { rationCardNumber: { contains: search } },
            { houseOwnerName: { contains: search } },
            { houseOwnerContact: { contains: search } },
            { occupation: { contains: search } },
            { govtScheme: { contains: search } },
            { party: { contains: search } },

            {
              category: {
                name: { contains: search },
              },
            },
            {
              part: {
                name: { contains: search },
              },
            },
            {
              ward: {
                wardNo: { contains: search },
              },
            },
            {
              area: {
                name: { contains: search },
              },
            },
          ],
        }
      : {};

    const [voters, total] = await Promise.all([
      prisma.voter.findMany({
        where: whereCondition,
        include: {
          category: true,
          part: true,
          ward: true,
          area: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),

      prisma.voter.count({
        where: whereCondition,
      }),
    ]);

    res.json({
      data: voters,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch voters",
      error: error.message,
    });
  }
};

// ---------------- EXPORT EXCEL ----------------

const exportVotersExcel = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const whereCondition = search
      ? {
          OR: [
            { voterName: { contains: search } },
            { rollNo: { contains: search } },
            { phone: { contains: search } },
            { gender: { contains: search } },
            { address: { contains: search } },
            { aadharNumber: { contains: search } },
            { voterId: { contains: search } },
            { rationCardNumber: { contains: search } },
            { houseOwnerName: { contains: search } },
            { houseOwnerContact: { contains: search } },
            { occupation: { contains: search } },
            { govtScheme: { contains: search } },
            { party: { contains: search } },
            { category: { name: { contains: search } } },
            { part: { name: { contains: search } } },
            { ward: { wardNo: { contains: search } } },
            { area: { name: { contains: search } } },
          ],
        }
      : {};

    const voters = await prisma.voter.findMany({
      where: whereCondition,
      include: {
        category: true,
        part: true,
        ward: true,
        area: true,
      },
      skip,
      take: limit,
      orderBy: [
        { part: { name: "asc" } },
        { ward: { wardNo: "asc" } },
        { area: { name: "asc" } },
        { rollNo: "asc" },
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Voters");

    sheet.columns = [
      { header: "Photo (புகைப்படம்)", key: "photo" },
      { header: "Name (பெயர்)", key: "voterName" },
      { header: "Roll No (வரிசை எண்)", key: "rollNo" },
      { header: "Gender (பாலினம்)", key: "gender" },
      { header: "Age (வயது)", key: "age" },
      { header: "Category (வகை)", key: "category" },
      { header: "Part No (பாகம் எண்)", key: "part" },
      { header: "Ward No (வார்டு எண்)", key: "ward" },
      { header: "Area (பகுதி)", key: "area" },
      { header: "Address (முகவரி)", key: "address" },
      { header: "Phone (தொலைபேசி)", key: "phone" },
      { header: "Aadhar Number (ஆதார் எண்)", key: "aadharNumber" },
      { header: "Voter ID (வாக்காளர் அட்டை)", key: "voterId" },
      { header: "Ration Card (ரேஷன் அட்டை)", key: "rationCardNumber" },
      { header: "Rental House (வாடகை வீடு)", key: "rentalHouse" },
      { header: "Owner Name (உரிமையாளர் பெயர்)", key: "houseOwnerName" },
      {
        header: "Owner Contact (உரிமையாளர் தொலைபேசி)",
        key: "houseOwnerContact",
      },
      { header: "Occupation (வேலை)", key: "occupation" },
      { header: "Govt Scheme (அரசு திட்டம்)", key: "govtScheme" },
      { header: "Party (கட்சி)", key: "party" },
    ];

    // Auto column width based on header
    sheet.columns.forEach((column) => {
      const headerLength = column.header.length;
      column.width = headerLength + 5;
      if (column.width < 12) column.width = 12;
    });

    // Header Styling
    const headerRow = sheet.getRow(1);

    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: { argb: "FFFFFFFF" },
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "002d73" },
      };

      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    });

    for (let i = 0; i < voters.length; i++) {
      const v = voters[i];

      const row = sheet.addRow({
        voterName: v.voterName || "--",
        rollNo: v.rollNo || "--",
        gender: v.gender || "--",
        age: v.age || "--",
        category: v.category?.name || "--",
        part: v.part?.name || "--",
        ward: v.ward?.wardNo || "--",
        area: v.area?.name || "--",
        address: v.address || "--",
        phone: v.phone || "--",
        aadharNumber: v.aadharNumber || "--",
        voterId: v.voterId || "--",
        rationCardNumber: v.rationCardNumber || "--",
        rentalHouse: v.rentalHouse || "--",
        houseOwnerName: v.houseOwnerName || "--",
        houseOwnerContact: v.houseOwnerContact || "--",
        occupation: v.occupation || "--",
        govtScheme: v.govtScheme || "--",
        party: v.party || "--",
      });

      row.height = 65;

      if (v.photo) {
        try {
          let imageBuffer;
          let extension = "jpeg";

          if (v.photo.startsWith("http")) {
            const response = await axios.get(v.photo, {
              responseType: "arraybuffer",
            });

            imageBuffer = response.data;

            const ext = v.photo.split(".").pop().toLowerCase();
            extension = ext === "png" ? "png" : "jpeg";
          } else {
            const imagePath = path.join(
              process.cwd(),
              "uploads",
              path.basename(v.photo),
            );

            if (fs.existsSync(imagePath)) {
              imageBuffer = fs.readFileSync(imagePath);

              const ext = imagePath.split(".").pop().toLowerCase();
              extension = ext === "png" ? "png" : "jpeg";
            }
          }

          if (imageBuffer) {
            const imageId = workbook.addImage({
              buffer: imageBuffer,
              extension,
            });

            sheet.addImage(imageId, {
              tl: { col: 0, row: i + 1.1 },
              ext: { width: 70, height: 70 },
            });
          }
        } catch (err) {
          console.log("Image error:", err.message);
        }
      }
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader("Content-Disposition", "attachment; filename=voters.xlsx");

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    res.status(500).json({
      message: "Excel export failed",
      error: error.message,
    });
  }
};
const exportVoterListPDF = async (req, res) => {
  try {
    const voters = await prisma.voter.findMany({
      include: {
        category: true,
        part: true,
        ward: true,
        area: true,
      },
      orderBy: { rollNo: "asc" },
    });

    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    // Headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=voters.pdf");

    doc.pipe(res);

    // Title
    doc.fontSize(18).text("VOTER LIST", {
      align: "center",
    });

    doc.moveDown(2);

    voters.forEach((v, index) => {
      doc
        .fontSize(10)
        .text(`Name: ${v.voterName || "-"}`)
        .text(`Roll No: ${v.rollNo || "-"}`)
        .text(`Age: ${v.age || "-"}   Gender: ${v.gender || "-"}`)
        .text(`Category: ${v.category?.name || "-"}`)
        .text(`Part: ${v.part?.name || "-"}`)
        .text(`Ward: ${v.ward?.wardNo || "-"}`)
        .text(`Area: ${v.area?.name || "-"}`)
        .text(`Address: ${v.address || "-"}`)
        .text(`Phone: ${v.phone || "-"}`)
        .text(`Aadhar: ${v.aadharNumber || "-"}`)
        .text(`Voter ID: ${v.voterId || "-"}`)
        .text(`Ration Card: ${v.rationCardNumber || "-"}`)
        .text(`Rental House: ${v.rentalHouse || "-"}`)
        .text(`Owner: ${v.houseOwnerName || "-"}`)
        .text(`Owner Contact: ${v.houseOwnerContact || "-"}`)
        .text(`Occupation: ${v.occupation || "-"}`)
        .text(`Party: ${v.party || "-"}`)
        .text(`Govt Scheme: ${v.govtScheme || "-"}`);

      doc.moveDown();

      // Divider line
      doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();

      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "PDF export failed",
      error: error.message,
    });
  }
};

module.exports = {
  createVoter,
  updateVoter,
  deleteVoter,
  getAllVoters,
  getVotersPaginated,
  exportVotersExcel,
  exportVoterListPDF,
};
