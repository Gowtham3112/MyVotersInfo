import { useState, useEffect } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

import DeleteModal from "../../../component/common/DeleteModel";
import LoadingOverlay from "../../../component/others/LoadingOverlay";
import { useToast } from "../../../component/common/ToastContext";

import {
  getVotersPaginatedAPI,
  deleteVoterAPI,
  exportVotersExcelAPI,
  // exportVotersPDFAPI,
} from "../../../services/service_page/voter";

import jsPDF from "jspdf";

import type { Voter } from "../../../types/voter";
import AdminVoterForm from "./AdminVoterForm";

const AdminVoter = () => {
  const { showToast } = useToast();

  const [voterList, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState<Voter | undefined>(undefined);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [sortBy, setSortBy] = useState<string>("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  // ---------------- FETCH VOTERS ----------------
  const fetchVoters = async () => {
    try {
      setLoading(true);

      const sortPart = sortBy === "partName" ? order : "";
      const sortWard = sortBy === "wardNo" ? order : "";

      const res = await getVotersPaginatedAPI(
        page,
        limit,
        searchTerm,
        sortPart,
        sortWard,
      );

      setVoters(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotalRecords(res.pagination.total);
    } catch {
      showToast("Failed to load voters", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoters();
  }, [page, limit, searchTerm, sortBy, order]);

  useEffect(() => {
    setPage(1);
  }, [sortBy, order]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      // toggle asc ↔ desc
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // new column → default asc
      setSortBy(field);
      setOrder("asc");
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteVoterAPI(deleteId);
      showToast("Voter deleted successfully", "success");
      setDeleteId(null);
      fetchVoters();
    } catch {
      showToast("Failed to delete voter", "error");
    }
  };

  // ---------------- EXPORT EXCEL ----------------
  const handleExportExcel = async () => {
    try {
      setLoading(true);

      const sortPart = sortBy === "partName" ? order : "";
      const sortWard = sortBy === "wardNo" ? order : "";

      const blob = await exportVotersExcelAPI(
        page,
        limit,
        searchTerm,
        sortPart,
        sortWard,
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = "voters.xlsx";
      a.click();

      window.URL.revokeObjectURL(url);

      showToast("Excel downloaded", "success");
    } catch {
      showToast("Failed to export Excel", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- EXPORT PDF ----------------
  // const handleExportPDF = async () => {
  //   try {
  //     const blob = await exportVotersPDFAPI(page, limit, searchTerm);

  //     const url = window.URL.createObjectURL(blob);

  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = "voters.pdf";

  //     document.body.appendChild(link);
  //     link.click();

  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(url);

  //     showToast("PDF downloaded", "success");
  //   } catch {
  //     showToast("Failed to export PDF", "error");
  //   }
  // };

  const handleExportPDF = () => {
    try {
      setLoading(true);

      setTimeout(() => {
        const doc = new jsPDF("landscape");
        const pageWidth = 297;
        const pageHeight = 210;

        const cardWidth = 90;
        const cardHeight = 60;
        const colGap = 4;
        const rowGap = 4;
        const marginLeft = 7;
        const marginTop = 13;

        // ── PALETTE ──
        const deepNavy: [number, number, number] = [18, 40, 90];
        const softBlue: [number, number, number] = [235, 241, 255];
        const cardBorder: [number, number, number] = [200, 212, 235];
        const labelColor: [number, number, number] = [110, 120, 145];
        const valueColor: [number, number, number] = [20, 30, 55];
        const photoBoxBg: [number, number, number] = [225, 234, 255];
        const dividerBg: [number, number, number] = [245, 248, 255];
        const white: [number, number, number] = [255, 255, 255];
        const headerBg: [number, number, number] = [18, 40, 90];
        const headerText: [number, number, number] = [255, 255, 255];

        // ── PAGE HEADER (no yellow accent line) ──
        const drawPageHeader = () => {
          doc.setFillColor(...headerBg);
          doc.rect(0, 0, pageWidth, 11, "F");
          doc.setTextColor(...headerText);
          doc.setFontSize(13);
          doc.setFont("helvetica", "bold");
          doc.text("VOTER LIST", pageWidth / 2, 7.5, { align: "center" });
          doc.setTextColor(...valueColor);
        };

        // ── PHOTO PLACEHOLDER ──
        const drawPhotoPlaceholder = (
          px: number,
          py: number,
          pw: number,
          ph: number,
        ) => {
          doc.setFillColor(190, 205, 228);
          doc.circle(px + pw / 2, py + ph * 0.35, pw * 0.23, "F");
          doc.setFillColor(190, 205, 228);
          doc.ellipse(px + pw / 2, py + ph * 0.75, pw * 0.33, ph * 0.24, "F");
          doc.setFontSize(5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(150, 162, 185);
          doc.text("No Photo", px + pw / 2, py + ph - 1, { align: "center" });
        };

        const truncate = (val: string, max: number) =>
          val.length > max ? val.substring(0, max - 1) + "…" : val;

        const drawField = (
          label: string,
          value: string,
          lx: number,
          ly: number,
          labelW: number,
          maxValueLen: number,
        ) => {
          doc.setFontSize(5.8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...labelColor);
          doc.text(label + ":", lx, ly);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(...valueColor);
          doc.text(truncate(value, maxValueLen), lx + labelW, ly);
        };

        // ── VOTER CARD ──
        const drawVoterCard = (voter: any, x: number, y: number) => {
          // Card background — NO drop shadow
          doc.setFillColor(...white);
          doc.roundedRect(x, y, cardWidth, cardHeight, 2.5, 2.5, "F");

          // Card border only
          doc.setDrawColor(...cardBorder);
          doc.setLineWidth(0.4);
          doc.roundedRect(x, y, cardWidth, cardHeight, 2.5, 2.5, "S");

          // ── TOP ACCENT STRIP (thin colored line at top, no full blue header bg) ──
          doc.setFillColor(...deepNavy);
          doc.roundedRect(x, y, cardWidth, 2, 2.5, 2.5, "F");
          doc.rect(x, y + 0.8, cardWidth, 1.2, "F"); // flatten bottom edge of strip

          // ── VOTER NAME + ID row (plain white bg, dark text) ──
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...deepNavy);
          const name = voter.voterName || "Unknown Voter";
          doc.text(truncate(name, 28), x + 3, y + 8.5);

          doc.setFontSize(5.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(...labelColor);
          const vid = voter.voterId || "-";
          doc.text("ID: " + truncate(vid, 14), x + cardWidth - 3, y + 8.5, {
            align: "right",
          });

          // Thin separator under name row
          doc.setDrawColor(...cardBorder);
          doc.setLineWidth(0.25);
          doc.line(x + 2, y + 10.5, x + cardWidth - 2, y + 10.5);

          // ── PHOTO ──
          const photoX = x + 2.5;
          const photoY = y + 12.5;
          const photoW = 20;
          const photoH = 24;

          doc.setFillColor(...photoBoxBg);
          doc.setDrawColor(...cardBorder);
          doc.setLineWidth(0.3);
          doc.roundedRect(photoX, photoY, photoW, photoH, 1.5, 1.5, "FD");

          if (voter.photo) {
            try {
              doc.addImage(
                voter.photo,
                "JPEG",
                photoX + 0.8,
                photoY + 0.8,
                photoW - 1.6,
                photoH - 1.6,
              );
            } catch {
              drawPhotoPlaceholder(photoX, photoY, photoW, photoH);
            }
          } else {
            drawPhotoPlaceholder(photoX, photoY, photoW, photoH);
          }

          // Age + Gender pill below photo
          doc.setFillColor(...softBlue);
          doc.setDrawColor(...cardBorder);
          doc.setLineWidth(0.2);
          doc.roundedRect(photoX, photoY + photoH + 1.5, photoW, 5, 1, 1, "FD");
          doc.setFontSize(5.5);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...deepNavy);
          const agGender = `${voter.age || "-"} / ${voter.gender?.charAt(0) || "-"}`;
          doc.text(agGender, photoX + photoW / 2, photoY + photoH + 4.8, {
            align: "center",
          });

          // ── LEFT INFO COLUMN ──
          const col1X = x + 25;
          const col1LabelW = 14;
          let fy = y + 15;
          const lh = 6;

          const col1Fields: [string, string][] = [
            ["Category", voter.category?.name || "-"],
            ["Part", voter.part?.name || "-"],
            ["Ward", String(voter.ward?.wardNo || "-")],
            ["Area", voter.area?.name || "-"],
            ["Address", voter.address || "-"],
          ];

          col1Fields.forEach(([label, value]) => {
            drawField(label, value, col1X, fy, col1LabelW, 13);
            fy += lh;
          });

          // ── RIGHT INFO COLUMN ──
          const col2X = x + 57;
          const col2LabelW = 14;
          let fy2 = y + 15;

          const col2Fields: [string, string][] = [
            ["Phone", voter.phone || "-"],
            ["Aadhar", voter.aadharNumber || "-"],
            ["Party", voter.party || "-"],
            ["Scheme", voter.govtScheme || "-"],
            ["Ration", voter.rationCardNumber || "-"],
          ];

          col2Fields.forEach(([label, value]) => {
            drawField(label, value, col2X, fy2, col2LabelW, 13);
            fy2 += lh;
          });

          // ── DIVIDER SECTION ──
          const divY = y + cardHeight - 13;
          doc.setFillColor(...dividerBg);
          doc.rect(x + 0.5, divY, cardWidth - 1, 12.5, "F");
          doc.setDrawColor(...cardBorder);
          doc.setLineWidth(0.25);
          doc.line(x + 2, divY, x + cardWidth - 2, divY);

          // Bottom row fields
          const bFields: [string, string][] = [
            ["Owner", voter.houseOwnerName || "-"],
            ["Contact", voter.houseOwnerContact || "-"],
            ["Occup.", voter.occupation || "-"],
          ];

          const bCellW = (cardWidth - 24) / 3;
          bFields.forEach(([label, value], i) => {
            const bx = x + 2 + i * (bCellW + 1);
            doc.setFontSize(5.5);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...labelColor);
            doc.text(label, bx, divY + 4);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...valueColor);
            doc.text(truncate(value, 11), bx, divY + 9);
          });

          const isRental =
            voter.rentalHouse === true ||
            voter.rentalHouse === "Yes" ||
            voter.rentalHouse === "yes" ||
            voter.rentalHouse === 1;

          const rentalLabel = isRental ? "Rental" : "Own Home";

          const pillBg: [number, number, number] = isRental
            ? [255, 237, 200]
            : [220, 245, 225];

          const pillBorder: [number, number, number] = isRental
            ? [210, 120, 20]
            : [50, 155, 75];

          const pillText: [number, number, number] = isRental
            ? [150, 70, 10]
            : [25, 110, 50];

          const fontSize = 5.5;
          doc.setFontSize(fontSize);
          doc.setFont("helvetica", "bold");

          // calculate text size
          const textWidth = doc.getTextWidth(rentalLabel);

          // paddings
          const paddingX = 3;
          const paddingY = 2;

          // dynamic size
          const pillW = textWidth + paddingX * 2;
          const pillH = fontSize + paddingY * 2;

          const pillX = x + cardWidth - pillW - 2;
          const pillY = divY + 2;

          doc.setFillColor(...pillBg);
          doc.setDrawColor(...pillBorder);
          doc.setLineWidth(0.35);

          // rounded pill
          // doc.roundedRect(pillX, pillY, pillW, pillH, pillH / 2, pillH / 2, "FD");

          doc.setTextColor(...pillText);
          doc.text(
            rentalLabel,
            pillX + pillW / 2,
            pillY + pillH / 2 + fontSize * 0.35,
            {
              align: "center",
            },
          );
        };

        // ── FOOTER ──
        const drawFooter = (num: number, total: number) => {
          doc.setFontSize(6.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(155, 160, 170);
          doc.text(`Page ${num} of ${total}`, pageWidth / 2, pageHeight - 2.5, {
            align: "center",
          });
          const now = new Date().toLocaleDateString("en-IN");
          doc.text(`Generated: ${now}`, pageWidth - 5, pageHeight - 2.5, {
            align: "right",
          });
          doc.text(`Total Voters: ${voterList.length}`, 5, pageHeight - 2.5);
        };

        // ── RENDER ──
        const cols = 3;
        const rows = 2;
        const cardsPerPage = cols * rows;
        const totalPages = Math.ceil(voterList.length / cardsPerPage);

        const sorted = [...voterList].sort((a: any, b: any) => {
          const ra = parseInt(a.rollNo) || 0;
          const rb = parseInt(b.rollNo) || 0;
          return ra - rb;
        });

        let pageNum = 1;
        drawPageHeader();
        drawFooter(pageNum, totalPages);

        sorted.forEach((voter: any, index: number) => {
          const posOnPage = index % cardsPerPage;
          const col = posOnPage % cols;
          const row = Math.floor(posOnPage / cols);

          if (index > 0 && posOnPage === 0) {
            doc.addPage();
            pageNum++;
            drawPageHeader();
            drawFooter(pageNum, totalPages);
          }

          const x = marginLeft + col * (cardWidth + colGap);
          const y = marginTop + row * (cardHeight + rowGap);

          drawVoterCard(voter, x, y);
        });

        doc.save("voter_cards.pdf");

        showToast("PDF downloaded successfully", "success");
        setLoading(false);
      }, 100);
    } catch (err) {
      console.error(err);
      showToast("Failed to export PDF", "error");
      setLoading(false);
    }
  };

  // ---------------- ADD / EDIT ----------------
  const handleAdd = () => {
    setEditData(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (voter: Voter) => {
    setEditData(voter);
    setIsFormOpen(true);
  };

  const handleBackFromForm = () => {
    setIsFormOpen(false);
    fetchVoters();
  };

  // ---------------- PAGE NUMBERS ----------------
  const getPageNumbers = () => {
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  // ---------------- FORM VIEW ----------------
  if (isFormOpen) {
    return <AdminVoterForm onBack={handleBackFromForm} editVoter={editData} />;
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading && <LoadingOverlay />}

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-color)] flex items-center justify-center shadow-md">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  Voter (வாக்காளர்)
                </h1>
                <p className="text-slate-400 text-sm">
                  Manage and organise all registered voters
                </p>
              </div>
            </div>
            <div className="mt-4 h-px bg-gradient-to-r from-[var(--primary-color)] via-slate-200 to-transparent" />
          </div>

          {/* Stats Bar */}
          <div className="mb-6 flex items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-sm text-slate-600 shadow-sm">
              <Users size={13} className="text-[var(--primary-color)]" />
              <span>
                <strong className="text-slate-800">{totalRecords}</strong> total
                voters (வாக்காளர் எண்ணிக்கை)
              </span>
            </div>
            {searchTerm && (
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-sm text-blue-600">
                <Search size={13} />
                <span>Results for "{searchTerm}"</span>
              </div>
            )}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search voter..."
                value={searchTerm}
                onChange={(e) => {
                  setPage(1);
                  setSearchTerm(e.target.value);
                }}
                className="w-full sm:w-72 pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent shadow-sm transition"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportExcel}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <FileSpreadsheet size={15} />
                Excel
              </button>

              <button
                onClick={handleExportPDF}
                className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <FileText size={15} />
                PDF
              </button>

              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <Plus size={16} />
                Add Voter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="min-w-[900px] w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                      S.No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                      Category (உள்ளாட்சி அமைப்பு)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                      <div
                        onClick={() => handleSort("partName")}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        Part No (பாகம் எண்)
                        {sortBy === "partName"
                          ? order === "asc"
                            ? "🔼"
                            : "🔽"
                          : " ⇅"}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                      <div
                        onClick={() => handleSort("wardNo")}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        Ward No (வார்டு எண்)
                        {sortBy === "wardNo"
                          ? order === "asc"
                            ? "🔼"
                            : "🔽"
                          : " ⇅"}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                      Area (நகர்)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                      Voter (வாக்காளர்)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                      Roll No (வரிசை எண்)
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-white/80">
                      Edit
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-white/80">
                      Delete
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {voterList.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <Users size={24} className="text-slate-300" />
                          </div>
                          <p className="text-sm font-medium">No voters found</p>
                          <p className="text-xs text-slate-300">
                            Try adjusting your search or add a new voter
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {[...voterList]
                    .sort((a, b) => {
                      const ra = parseInt(a.rollNo) || 0;
                      const rb = parseInt(b.rollNo) || 0;
                      return ra - rb;
                    })
                    .map((voter, index) => (
                      <tr
                        key={voter.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
                            {(page - 1) * limit + index + 1}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {voter.category?.name ? (
                            <span className="inline-flex items-center text-xs font-medium bg-[var(--primary-color)]/10 text-[var(--primary-color)] rounded-full px-3 py-1">
                              {voter.category.name}
                            </span>
                          ) : (
                            <span className="text-slate-300 italic text-sm">
                              —
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          {voter.part?.name ? (
                            <span className="inline-flex items-center text-xs font-medium bg-slate-100 text-slate-600 rounded-full px-3 py-1">
                              {voter.part.name}
                            </span>
                          ) : (
                            <span className="text-slate-300 italic text-sm">
                              —
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          {voter.ward?.wardNo ? (
                            <span className="inline-flex items-center text-xs font-medium bg-slate-100 text-slate-600 rounded-full px-3 py-1">
                              {voter.ward.wardNo}
                            </span>
                          ) : (
                            <span className="text-slate-300 italic text-sm">
                              —
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          {voter.area?.name ? (
                            <span className="inline-flex items-center text-xs font-medium bg-amber-50 text-amber-600 rounded-full px-3 py-1">
                              {voter.area.name}
                            </span>
                          ) : (
                            <span className="text-slate-300 italic text-sm">
                              —
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-800 text-sm">
                            {voter.voterName}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-800 text-sm">
                            {voter.rollNo}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleEdit(voter)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition-all duration-150 hover:scale-110"
                          >
                            <Pencil size={14} />
                          </button>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setDeleteId(voter.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all duration-150 hover:scale-110"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              {/* Total + Rows per page */}
              <div className="flex items-center gap-4">
                <p className="text-xs text-slate-500">
                  <strong className="text-slate-700">{totalRecords}</strong>{" "}
                  total records
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Rows:</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setPage(1);
                      setLimit(Number(e.target.value));
                    }}
                    className="border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={250}>250</option>
                    <option value={500}>500</option>
                    <option value={1000}>1000</option>
                    <option value={5000}>5000</option>
                    <option value={10000}>10000</option>
                    <option value={15000}>15000</option>
                  </select>
                </div>
              </div>

              {/* Page Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={15} />
                </button>

                {getPageNumbers().map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border text-xs font-semibold transition ${
                      page === p
                        ? "bg-[var(--primary-color)] border-[var(--primary-color)] text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default AdminVoter;
