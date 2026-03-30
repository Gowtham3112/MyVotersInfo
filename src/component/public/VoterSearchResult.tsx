import { useEffect, useState } from "react";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
import { searchVotersAPI } from "../../services/service_page/search";
import { exportVotersExcelAPI } from "../../services/service_page/voter";
import { useToast } from "../common/ToastContext";
import LoadingOverlay from "../others/LoadingOverlay";

interface Props {
  voters: any[];
  type: string;
  query: string;
}

const VoterSearchResult: React.FC<Props> = ({
  voters: initialVoters,
  type,
  query,
}) => {
  const [voters, setVoters] = useState<any[]>(initialVoters);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const pageSizes = [10, 20, 50, 100, 250, 500, 1000, 5000, 10000, 15000];

  useEffect(() => {
    setVoters(initialVoters);
    if (initialVoters.length < 10) {
      setLimit(initialVoters.length || 1);
    } else {
      setLimit(10);
    }
    setPage(1);
  }, [initialVoters]);

  const totalPages = Math.ceil(voters.length / (limit || 1));
  // SORT DATA
  const sortedVoters = [...voters].sort((a, b) => {
    if ((a.part?.name || "") !== (b.part?.name || "")) {
      return (a.part?.name || "").localeCompare(b.part?.name || "", undefined, {
        numeric: true,
      });
    }

    if ((a.ward?.wardNo || 0) !== (b.ward?.wardNo || 0)) {
      return (a.ward?.wardNo || 0) - (b.ward?.wardNo || 0);
    }

    if ((a.area?.name || "") !== (b.area?.name || "")) {
      return (a.area?.name || "").localeCompare(b.area?.name || "");
    }

    return (a.rollNo || 0) - (b.rollNo || 0);
  });

  const paginatedData = sortedVoters.slice((page - 1) * limit, page * limit);

  // API CALL
  const fetchData = async (
    pageNo: number,
    limitNo: number,
    searchText: string,
  ) => {
    try {
      const res = await searchVotersAPI(
        type,
        query,
        searchText,
        pageNo,
        limitNo,
      );
      setVoters(res?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // SEARCH BOX API CALL
  const handleSearch = () => {
    setPage(1);
    fetchData(1, limit, search);
  };

  // PAGE CHANGE API CALL

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchData(newPage, limit, search);
  };

  // LIMIT CHANGE API CALL

  const handleLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
    fetchData(1, value, search);
  };

  // EXCEL EXPORT

  const handleExcelExport = async () => {
    try {
      setLoading(true);

      const searchValue = search && search.trim() !== "" ? search : query;

      const response = await exportVotersExcelAPI(page, limit, searchValue);

      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "voters.xlsx";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast("Excel downloaded successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to export Excel", "error");
    } finally {
      setLoading(false);
    }
  };

  // PDF EXPORT

  // const handlePDFExport = () => {
  //   try {
  //     setLoading(true);

  //     setTimeout(() => {
  //       const doc = new jsPDF("landscape");
  //       const pageWidth = 297;
  //       const pageHeight = 210;

  //       const cardWidth = 90;
  //       const cardHeight = 60;
  //       const colGap = 4;
  //       const rowGap = 4;
  //       const marginLeft = 7;
  //       const marginTop = 13;

  //       // ── PALETTE ──
  //       const deepNavy: [number, number, number] = [18, 40, 90];
  //       const softBlue: [number, number, number] = [235, 241, 255];
  //       const cardBorder: [number, number, number] = [200, 212, 235];
  //       const labelColor: [number, number, number] = [110, 120, 145];
  //       const valueColor: [number, number, number] = [20, 30, 55];
  //       const photoBoxBg: [number, number, number] = [225, 234, 255];
  //       const dividerBg: [number, number, number] = [245, 248, 255];
  //       const white: [number, number, number] = [255, 255, 255];
  //       const headerBg: [number, number, number] = [18, 40, 90];
  //       const headerText: [number, number, number] = [255, 255, 255];

  //       // ── PAGE HEADER (no yellow accent line) ──
  //       const drawPageHeader = () => {
  //         doc.setFillColor(...headerBg);
  //         doc.rect(0, 0, pageWidth, 11, "F");
  //         doc.setTextColor(...headerText);
  //         doc.setFontSize(13);
  //         doc.setFont("helvetica", "bold");
  //         doc.text("VOTER LIST", pageWidth / 2, 7.5, { align: "center" });
  //         doc.setTextColor(...valueColor);
  //       };

  //       // ── PHOTO PLACEHOLDER ──
  //       const drawPhotoPlaceholder = (
  //         px: number,
  //         py: number,
  //         pw: number,
  //         ph: number,
  //       ) => {
  //         doc.setFillColor(190, 205, 228);
  //         doc.circle(px + pw / 2, py + ph * 0.35, pw * 0.23, "F");
  //         doc.setFillColor(190, 205, 228);
  //         doc.ellipse(px + pw / 2, py + ph * 0.75, pw * 0.33, ph * 0.24, "F");
  //         doc.setFontSize(5);
  //         doc.setFont("helvetica", "normal");
  //         doc.setTextColor(150, 162, 185);
  //         doc.text("No Photo", px + pw / 2, py + ph - 1, { align: "center" });
  //       };

  //       const truncate = (val: string, max: number) =>
  //         val.length > max ? val.substring(0, max - 1) + "…" : val;

  //       const drawField = (
  //         label: string,
  //         value: string,
  //         lx: number,
  //         ly: number,
  //         labelW: number,
  //         maxValueLen: number,
  //       ) => {
  //         doc.setFontSize(5.8);
  //         doc.setFont("helvetica", "bold");
  //         doc.setTextColor(...labelColor);
  //         doc.text(label + ":", lx, ly);
  //         doc.setFont("helvetica", "normal");
  //         doc.setTextColor(...valueColor);
  //         doc.text(truncate(value, maxValueLen), lx + labelW, ly);
  //       };

  //       // ── VOTER CARD ──
  //       const drawVoterCard = (voter: any, x: number, y: number) => {
  //         // Card background — NO drop shadow
  //         doc.setFillColor(...white);
  //         doc.roundedRect(x, y, cardWidth, cardHeight, 2.5, 2.5, "F");

  //         // Card border only
  //         doc.setDrawColor(...cardBorder);
  //         doc.setLineWidth(0.4);
  //         doc.roundedRect(x, y, cardWidth, cardHeight, 2.5, 2.5, "S");

  //         // ── TOP ACCENT STRIP (thin colored line at top, no full blue header bg) ──
  //         doc.setFillColor(...deepNavy);
  //         doc.roundedRect(x, y, cardWidth, 2, 2.5, 2.5, "F");
  //         doc.rect(x, y + 0.8, cardWidth, 1.2, "F"); // flatten bottom edge of strip

  //         // ── VOTER NAME + ID row (plain white bg, dark text) ──
  //         doc.setFontSize(7.5);
  //         doc.setFont("helvetica", "bold");
  //         doc.setTextColor(...deepNavy);
  //         const name = voter.voterName || "Unknown Voter";
  //         doc.text(truncate(name, 28), x + 3, y + 8.5);

  //         doc.setFontSize(5.5);
  //         doc.setFont("helvetica", "normal");
  //         doc.setTextColor(...labelColor);
  //         const vid = voter.voterId || "-";
  //         doc.text("Voter ID: " + truncate(vid, 14), x + cardWidth - 3, y + 8.5, {
  //           align: "right",
  //         });

  //         // Thin separator under name row
  //         doc.setDrawColor(...cardBorder);
  //         doc.setLineWidth(0.25);
  //         doc.line(x + 2, y + 10.5, x + cardWidth - 2, y + 10.5);

  //         // ── PHOTO ──
  //         const photoX = x + 2.5;
  //         const photoY = y + 12.5;
  //         const photoW = 20;
  //         const photoH = 24;

  //         doc.setFillColor(...photoBoxBg);
  //         doc.setDrawColor(...cardBorder);
  //         doc.setLineWidth(0.3);
  //         doc.roundedRect(photoX, photoY, photoW, photoH, 1.5, 1.5, "FD");

  //         if (voter.photo) {
  //           try {
  //             doc.addImage(
  //               voter.photo,
  //               "JPEG",
  //               photoX + 0.8,
  //               photoY + 0.8,
  //               photoW - 1.6,
  //               photoH - 1.6,
  //             );
  //           } catch {
  //             drawPhotoPlaceholder(photoX, photoY, photoW, photoH);
  //           }
  //         } else {
  //           drawPhotoPlaceholder(photoX, photoY, photoW, photoH);
  //         }

  //         // Age + Gender pill below photo
  //         doc.setFillColor(...softBlue);
  //         doc.setDrawColor(...cardBorder);
  //         doc.setLineWidth(0.2);
  //         doc.roundedRect(photoX, photoY + photoH + 1.5, photoW, 5, 1, 1, "FD");
  //         doc.setFontSize(5.5);
  //         doc.setFont("helvetica", "bold");
  //         doc.setTextColor(...deepNavy);
  //         const agGender = `${voter.age || "-"} / ${voter.gender?.charAt(0) || "-"}`;
  //         doc.text(agGender, photoX + photoW / 2, photoY + photoH + 4.8, {
  //           align: "center",
  //         });

  //         // ── LEFT INFO COLUMN ──
  //         const col1X = x + 25;
  //         const col1LabelW = 14;
  //         let fy = y + 15;
  //         const lh = 6;

  //         const col1Fields: [string, string][] = [
  //           ["Category", voter.category?.name || "-"],
  //           ["Part", voter.part?.name || "-"],
  //           ["Ward", String(voter.ward?.wardNo || "-")],
  //           ["Area", voter.area?.name || "-"],
  //           ["Address", voter.address || "-"],
  //         ];

  //         col1Fields.forEach(([label, value]) => {
  //           drawField(label, value, col1X, fy, col1LabelW, 13);
  //           fy += lh;
  //         });

  //         // ── RIGHT INFO COLUMN ──
  //         const col2X = x + 57;
  //         const col2LabelW = 14;
  //         let fy2 = y + 15;

  //         const col2Fields: [string, string][] = [
  //           ["Phone", voter.phone || "-"],
  //           ["Aadhar", voter.aadharNumber || "-"],
  //           ["Party", voter.party || "-"],
  //           ["Scheme", voter.govtScheme || "-"],
  //           ["Ration", voter.rationCardNumber || "-"],
  //         ];

  //         col2Fields.forEach(([label, value]) => {
  //           drawField(label, value, col2X, fy2, col2LabelW, 13);
  //           fy2 += lh;
  //         });

  //         // ── DIVIDER SECTION ──
  //         const divY = y + cardHeight - 13;
  //         doc.setFillColor(...dividerBg);
  //         doc.rect(x + 0.5, divY, cardWidth - 1, 12.5, "F");
  //         doc.setDrawColor(...cardBorder);
  //         doc.setLineWidth(0.25);
  //         doc.line(x + 2, divY, x + cardWidth - 2, divY);

  //         // Bottom row fields
  //         const bFields: [string, string][] = [
  //           ["Owner", voter.houseOwnerName || "-"],
  //           ["Contact", voter.houseOwnerContact || "-"],
  //           ["Occup.", voter.occupation || "-"],
  //         ];

  //         const bCellW = (cardWidth - 24) / 3;
  //         bFields.forEach(([label, value], i) => {
  //           const bx = x + 2 + i * (bCellW + 1);
  //           doc.setFontSize(5.5);
  //           doc.setFont("helvetica", "bold");
  //           doc.setTextColor(...labelColor);
  //           doc.text(label, bx, divY + 4);
  //           doc.setFont("helvetica", "normal");
  //           doc.setTextColor(...valueColor);
  //           doc.text(truncate(value, 11), bx, divY + 9);
  //         });

  //         const isRental =
  //           voter.rentalHouse === true ||
  //           voter.rentalHouse === "Yes" ||
  //           voter.rentalHouse === "yes" ||
  //           voter.rentalHouse === 1;

  //         const rentalLabel = isRental ? "Rental" : "Own Home";

  //         const pillBg: [number, number, number] = isRental
  //           ? [255, 237, 200]
  //           : [220, 245, 225];

  //         const pillBorder: [number, number, number] = isRental
  //           ? [210, 120, 20]
  //           : [50, 155, 75];

  //         const pillText: [number, number, number] = isRental
  //           ? [150, 70, 10]
  //           : [25, 110, 50];

  //         const fontSize = 5.5;
  //         doc.setFontSize(fontSize);
  //         doc.setFont("helvetica", "bold");

  //         // calculate text size
  //         const textWidth = doc.getTextWidth(rentalLabel);

  //         // paddings
  //         const paddingX = 3;
  //         const paddingY = 2;

  //         // dynamic size
  //         const pillW = textWidth + paddingX * 2;
  //         const pillH = fontSize + paddingY * 2;

  //         const pillX = x + cardWidth - pillW - 2;
  //         const pillY = divY + 2;

  //         doc.setFillColor(...pillBg);
  //         doc.setDrawColor(...pillBorder);
  //         doc.setLineWidth(0.35);

  //         // rounded pill
  //         // doc.roundedRect(pillX, pillY, pillW, pillH, pillH / 2, pillH / 2, "FD");

  //         doc.setTextColor(...pillText);
  //         doc.text(
  //           rentalLabel,
  //           pillX + pillW / 2,
  //           pillY + pillH / 2 + fontSize * 0.35,
  //           {
  //             align: "center",
  //           },
  //         );
  //       };

  //       // ── FOOTER ──
  //       const drawFooter = (num: number, total: number) => {
  //         doc.setFontSize(6.5);
  //         doc.setFont("helvetica", "normal");
  //         doc.setTextColor(155, 160, 170);
  //         doc.text(`Page ${num} of ${total}`, pageWidth / 2, pageHeight - 2.5, {
  //           align: "center",
  //         });
  //         const now = new Date().toLocaleDateString("en-IN");
  //         doc.text(`Generated: ${now}`, pageWidth - 5, pageHeight - 2.5, {
  //           align: "right",
  //         });
  //         doc.text(`Total Voters: ${voters.length}`, 5, pageHeight - 2.5);
  //       };

  //       // ── RENDER ──
  //       const cols = 3;
  //       const rows = 2;
  //       const cardsPerPage = cols * rows;
  //       const totalPages = Math.ceil(voters.length / cardsPerPage);

  //       const sorted = [...voters].sort((a: any, b: any) => {
  //         const ra = parseInt(a.rollNo) || 0;
  //         const rb = parseInt(b.rollNo) || 0;
  //         return ra - rb;
  //       });

  //       let pageNum = 1;
  //       drawPageHeader();
  //       drawFooter(pageNum, totalPages);

  //       sorted.forEach((voter: any, index: number) => {
  //         const posOnPage = index % cardsPerPage;
  //         const col = posOnPage % cols;
  //         const row = Math.floor(posOnPage / cols);

  //         if (index > 0 && posOnPage === 0) {
  //           doc.addPage();
  //           pageNum++;
  //           drawPageHeader();
  //           drawFooter(pageNum, totalPages);
  //         }

  //         const x = marginLeft + col * (cardWidth + colGap);
  //         const y = marginTop + row * (cardHeight + rowGap);

  //         drawVoterCard(voter, x, y);
  //       });

  //       doc.save("voter_cards.pdf");

  //       showToast("PDF downloaded successfully", "success");
  //       setLoading(false);
  //     }, 100);
  //   } catch (err) {
  //     console.error(err);
  //     showToast("Failed to export PDF", "error");
  //     setLoading(false);
  //   }
  // };

  const handlePDFExport = async () => {
    try {
      setLoading(true);

      // ── FETCH TAMIL FONT ──
      const fontResponse = await fetch("/src/font/NotoSansTamil-Regular.ttf");
      const fontBuffer = await fontResponse.arrayBuffer();
      const fontBase64 = btoa(
        new Uint8Array(fontBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          "",
        ),
      );

      const doc = new jsPDF("landscape");
      const pageWidth = 297;
      const pageHeight = 210;

      const cardWidth = 95;
      const cardHeight = 78;
      const colGap = 3;
      const rowGap = 4;
      const marginLeft = 6;
      const marginTop = 13;

      // ── REGISTER TAMIL FONT ──
      doc.addFileToVFS("NotoSansTamil.ttf", fontBase64);
      doc.addFont("NotoSansTamil.ttf", "NotoSansTamil", "normal");

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

      // ── TAMIL DETECTION ──
      const isTamil = (text: string): boolean => /[\u0B80-\u0BFF]/.test(text);

      // ── FONT HELPERS ──
      const setSmartFont = (size: number = 6) => {
        doc.setFont("NotoSansTamil", "normal");
        doc.setFontSize(size);
      };

      const setLatinFont = (
        style: "bold" | "normal" = "normal",
        size: number = 5.8,
      ) => {
        doc.setFont("helvetica", style);
        doc.setFontSize(size);
      };

      // ── PAGE HEADER ──
      const drawPageHeader = () => {
        doc.setFillColor(...headerBg);
        doc.rect(0, 0, pageWidth, 11, "F");
        doc.setTextColor(...headerText);
        setLatinFont("bold", 13);
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
        setLatinFont("normal", 5);
        doc.setTextColor(150, 162, 185);
        doc.text("No Photo", px + pw / 2, py + ph - 1, { align: "center" });
      };

      // ── DRAW FIELD — set font BEFORE splitTextToSize so measurements are correct ──
      const drawField = (
        label: string,
        value: string,
        lx: number,
        ly: number,
        labelW: number,
        maxW: number,
      ): number => {
        // Label — always English bold
        setLatinFont("bold", 5.8);
        doc.setTextColor(...labelColor);
        doc.text(label + ":", lx, ly);

        // ── CRITICAL: set font BEFORE splitTextToSize ──
        const useTamil = isTamil(value);
        if (useTamil) {
          setSmartFont(6);
        } else {
          setLatinFont("normal", 5.8);
        }

        // Now jsPDF measures with the correct font
        const lines: string[] = doc.splitTextToSize(value || "-", maxW);
        const lineHeight = useTamil ? 6.5 : 5.5;

        doc.setTextColor(...valueColor);
        lines.forEach((line: string, i: number) => {
          // Re-apply font per line to prevent jsPDF internal resets
          if (useTamil) {
            setSmartFont(6);
          } else {
            setLatinFont("normal", 5.8);
          }
          doc.setTextColor(...valueColor);
          doc.text(line, lx + labelW, ly + i * lineHeight);
        });

        return lines.length;
      };

      // ── VOTER CARD ──
      const drawVoterCard = (voter: any, x: number, y: number) => {
        // Card background
        doc.setFillColor(...white);
        doc.roundedRect(x, y, cardWidth, cardHeight, 2.5, 2.5, "F");

        // Card border
        doc.setDrawColor(...cardBorder);
        doc.setLineWidth(0.4);
        doc.roundedRect(x, y, cardWidth, cardHeight, 2.5, 2.5, "S");

        // ── TOP ACCENT STRIP ──
        doc.setFillColor(...deepNavy);
        doc.roundedRect(x, y, cardWidth, 2, 2.5, 2.5, "F");
        doc.rect(x, y + 0.8, cardWidth, 1.2, "F");

        // ── VOTER NAME ──
        const name = voter.voterName || "Unknown Voter";
        const useTamilName = isTamil(name);
        if (useTamilName) {
          setSmartFont(7);
        } else {
          setLatinFont("bold", 7.5);
        }
        doc.setTextColor(...deepNavy);
        const nameLines: string[] = doc.splitTextToSize(name, cardWidth - 42);
        nameLines.slice(0, 2).forEach((line: string, i: number) => {
          if (useTamilName) {
            setSmartFont(7);
          } else {
            setLatinFont("bold", 7.5);
          }
          doc.setTextColor(...deepNavy);
          doc.text(line, x + 3, y + 8 + i * 5.5);
        });

        // ── VOTER ID ──
        setLatinFont("normal", 5.5);
        doc.setTextColor(...labelColor);
        doc.text("ID: " + (voter.voterId || "-"), x + cardWidth - 3, y + 8.5, {
          align: "right",
        });

        // Separator
        doc.setDrawColor(...cardBorder);
        doc.setLineWidth(0.25);
        doc.line(x + 2, y + 11.5, x + cardWidth - 2, y + 11.5);

        // ── PHOTO ──
        const photoX = x + 2.5;
        const photoY = y + 13.5;
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

        // Age + Gender pill
        doc.setFillColor(...softBlue);
        doc.setDrawColor(...cardBorder);
        doc.setLineWidth(0.2);
        doc.roundedRect(photoX, photoY + photoH + 1.5, photoW, 5, 1, 1, "FD");
        setLatinFont("bold", 5.5);
        doc.setTextColor(...deepNavy);
        const agGender = `${voter.age || "-"} / ${voter.gender?.charAt(0) || "-"}`;
        doc.text(agGender, photoX + photoW / 2, photoY + photoH + 4.8, {
          align: "center",
        });

        // ── LEFT INFO COLUMN ──
        const col1X = x + 26;
        const col1LabelW = 15;
        const col1ValueW = 26;
        let fy = y + 15.5;
        const baseLineH = 6.2;

        const col1Fields: [string, string][] = [
          ["Category", voter.category?.name || "-"],
          ["Part", voter.part?.name || "-"],
          ["Ward", String(voter.ward?.wardNo || "-")],
          ["Area", voter.area?.name || "-"],
          ["Address", voter.address || "-"],
        ];

        col1Fields.forEach(([label, value]) => {
          const lineCount = drawField(
            label,
            value,
            col1X,
            fy,
            col1LabelW,
            col1ValueW,
          );
          const lineH = isTamil(value) ? 6.5 : 5.5;
          fy += baseLineH + Math.max(0, lineCount - 1) * lineH;
        });

        // ── RIGHT INFO COLUMN ──
        const col2X = x + 60;
        const col2LabelW = 13;
        const col2ValueW = 22;
        let fy2 = y + 15.5;

        const col2Fields: [string, string][] = [
          ["Phone", voter.phone || "-"],
          ["Aadhar", voter.aadharNumber || "-"],
          ["Party", voter.party || "-"],
          ["Scheme", voter.govtScheme || "-"],
          ["Ration", voter.rationCardNumber || "-"],
        ];

        col2Fields.forEach(([label, value]) => {
          const lineCount = drawField(
            label,
            value,
            col2X,
            fy2,
            col2LabelW,
            col2ValueW,
          );
          const lineH = isTamil(value) ? 6.5 : 5.5;
          fy2 += baseLineH + Math.max(0, lineCount - 1) * lineH;
        });

        // ── DIVIDER SECTION ──
        const divY = y + cardHeight - 14;
        doc.setFillColor(...dividerBg);
        doc.rect(x + 0.5, divY, cardWidth - 1, 13.5, "F");
        doc.setDrawColor(...cardBorder);
        doc.setLineWidth(0.25);
        doc.line(x + 2, divY, x + cardWidth - 2, divY);

        // Bottom row fields
        const bFields: [string, string][] = [
          ["Owner", voter.houseOwnerName || "-"],
          ["Contact", voter.houseOwnerContact || "-"],
          ["Occup.", voter.occupation || "-"],
        ];

        const bCellW = (cardWidth - 26) / 3;
        bFields.forEach(([label, value], i) => {
          const bx = x + 2 + i * (bCellW + 1);

          setLatinFont("bold", 5.5);
          doc.setTextColor(...labelColor);
          doc.text(label, bx, divY + 4);

          // ── Set font BEFORE splitTextToSize for bottom row too ──
          const useTamil = isTamil(value);
          if (useTamil) {
            setSmartFont(5.5);
          } else {
            setLatinFont("normal", 5.5);
          }
          doc.setTextColor(...valueColor);

          const bLines: string[] = doc.splitTextToSize(
            value || "-",
            bCellW - 1,
          );
          bLines.slice(0, 2).forEach((line: string, li: number) => {
            if (useTamil) {
              setSmartFont(5.5);
            } else {
              setLatinFont("normal", 5.5);
            }
            doc.setTextColor(...valueColor);
            doc.text(line, bx, divY + 8.5 + li * 5);
          });
        });

        // ── RENTAL PILL ──
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

        setLatinFont("bold", 5.5);
        const textWidth = doc.getTextWidth(rentalLabel);
        const paddingX = 3;
        const paddingY = 2;
        const pillW = textWidth + paddingX * 2;
        const pillH = 5.5 + paddingY * 2;
        const pillX = x + cardWidth - pillW - 2;
        const pillY = divY + 1.5;

        doc.setFillColor(...pillBg);
        doc.setDrawColor(...pillBorder);
        doc.setLineWidth(0.35);
        doc.roundedRect(pillX, pillY, pillW, pillH, 1, 1, "FD");
        doc.setTextColor(...pillText);
        doc.text(
          rentalLabel,
          pillX + pillW / 2,
          pillY + pillH / 2 + 5.5 * 0.35,
          {
            align: "center",
          },
        );
      };

      // ── FOOTER ──
      const drawFooter = (num: number, total: number) => {
        setLatinFont("normal", 6.5);
        doc.setTextColor(155, 160, 170);
        doc.text(`Page ${num} of ${total}`, pageWidth / 2, pageHeight - 2.5, {
          align: "center",
        });
        const now = new Date().toLocaleDateString("en-IN");
        doc.text(`Generated: ${now}`, pageWidth - 5, pageHeight - 2.5, {
          align: "right",
        });
        doc.text(`Total Voters: ${voters.length}`, 5, pageHeight - 2.5);
      };

      // ── RENDER ──
      const cols = 3;
      const rows = 2;
      const cardsPerPage = cols * rows;
      const totalPages = Math.ceil(voters.length / cardsPerPage);

      const sorted = [...voters].sort((a: any, b: any) => {
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
    } catch (err) {
      console.error(err);
      showToast("Failed to export PDF", "error");
      setLoading(false);
    }
  };

  // BADGE HELPER

  const GenderBadge = ({ gender }: { gender: string }) => {
    const isMale = gender?.toLowerCase() === "male";
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${
          isMale
            ? "bg-blue-100 text-blue-700 border border-blue-200"
            : "bg-pink-100 text-pink-700 border border-pink-200"
        }`}
      >
        {isMale ? "♂" : "♀"} {gender}
      </span>
    );
  };

  const InfoCard = ({
    label,
    value,
  }: {
    label: string;
    value: string | number | undefined;
  }) => (
    <div className="group relative bg-white border border-gray-100 rounded-2xl p-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-800 truncate">
        {value || "—"}
      </p>
    </div>
  );

  // EMPTY STATE

  if (!voters.length) {
    return (
      <>
        {loading && <LoadingOverlay />}
        <div className="flex flex-col items-center justify-center py-4 px-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-10 flex flex-col items-center max-w-sm w-full text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-5">
              <svg
                className="w-7 h-7 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <circle cx="11" cy="11" r="8" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35"
                />
              </svg>
            </div>

            <h2 className="text-base font-semibold text-slate-700 mb-1">
              No Data Found
            </h2>
            <p className="text-sm text-slate-400">
              No voters matched your search. Try a different keyword or filter.
            </p>
          </div>
        </div>
      </>
    );
  }

  // SINGLE RESULT VIEW
  if (voters.length === 1) {
    const v = voters[0];
    return (
      <>
        {loading && <LoadingOverlay />}
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4 sm:p-6 lg:p-8">
          <div className="max-w-8xl mx-auto">
            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden mb-5">
              <div className="h-1.5 w-full bg-[var(--primary-color)]" />

              <div className="p-6 sm:p-8">
                <div className="absolute top-6 right-6 flex gap-2">
                  <button
                    onClick={handleExcelExport}
                    title="Export Excel"
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all duration-150 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <FaFileExcel className="text-sm" />
                    <span className="hidden sm:inline">Excel</span>
                  </button>
                  <button
                    onClick={handlePDFExport}
                    title="Export PDF"
                    className="flex items-center gap-1.5 px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all duration-150 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <FaFilePdf className="text-sm" />
                    <span className="hidden sm:inline">PDF</span>
                  </button>
                </div>

                {/* Voter Profile */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="relative flex-shrink-0">
                    <img
                      src={v.photo}
                      alt={v.voterName}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-lg border-4 border-white ring-2 ring-gray-100"
                    />
                  </div>

                  <div className="flex-1 min-w-0 pr-24 sm:pr-0">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight truncate">
                      {v.voterName}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <GenderBadge gender={v.gender} />
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                        Age {v.age}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        Roll #{v.rollNo}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 flex items-center gap-1.5">
                      <svg
                        className="w-3.5 h-3.5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {v.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <InfoCard
                label="Category (உள்ளாட்சி அமைப்பு)"
                value={v.category?.name}
              />
              <InfoCard label="Part No (பாகம் எண்)" value={v.part?.name} />
              <InfoCard label="Ward No (வார்டு எண்)" value={v.ward?.wardNo} />
              <InfoCard label="Area (பகுதி)" value={v.area?.name} />
              <InfoCard label="Phone (தொலைபேசி)" value={v.phone} />
              <InfoCard label="Aadhar No (ஆதார் எண்)" value={v.aadharNumber} />
              <InfoCard label="Voter ID (வாக்காளர் அட்டை)" value={v.voterId} />
              <InfoCard
                label="Ration Card (ரேஷன் கார்டு)"
                value={v.rationCardNumber}
              />
              <InfoCard
                label="Rental House (வாடகை வீடு)"
                value={v.rentalHouse}
              />
              <InfoCard
                label="House Owner (வீட்டு உரிமையாளர்)"
                value={v.houseOwnerName}
              />
              <InfoCard
                label="Owner Contact (உரிமையாளர் தொலைபேசி)"
                value={v.houseOwnerContact}
              />
              <InfoCard label="Occupation (வேலை)" value={v.occupation} />
              <InfoCard
                label="Govt Scheme (அரசு திட்டம்)"
                value={v.govtScheme}
              />
              <InfoCard label="Party (கட்சி)" value={v.party} />
            </div>
          </div>
        </div>
      </>
    );
  }

  //  MULTIPLE RESULT VIEW

  const startEntry = (page - 1) * limit + 1;
  const endEntry = Math.min(page * limit, voters.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4 sm:p-6">
      {loading && <LoadingOverlay />}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-[var(--primary-color)]" />

        {/* Toolbar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
          {/* Entries selector */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Show</span>
            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="border border-gray-200 bg-gray-50 hover:border-[var(--primary-color)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 px-2.5 py-1.5 rounded-lg text-sm font-semibold text-gray-700 transition-all outline-none cursor-pointer"
            >
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="font-medium">entries</span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search Box */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search voters..."
              className="pl-9 pr-4 py-2 border border-gray-200 bg-gray-50 hover:border-[var(--primary-color)] focus:border-[var(--primary-color)] focus:ring-0 focus:ring-[var(--primary-color)]/20 rounded-xl text-sm outline-none transition-all w-48 sm:w-56 placeholder-gray-400"
            />
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleExcelExport}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all duration-150 hover:shadow-md hover:-translate-y-0.5"
            >
              <FaFileExcel />
              <span>Excel</span>
            </button>
            <button
              onClick={handlePDFExport}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all duration-150 hover:shadow-md hover:-translate-y-0.5"
            >
              <FaFilePdf />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-sm min-w-[1900px]">
            <thead>
              <tr className="bg-[var(--primary-color)] text-white">
                {[
                  "Photo (புகைப்படம்)",
                  "Name (பெயர்)",
                  "Roll No (வரிசை எண்)",
                  "Gender (பாலினம்)",
                  "Age (வயது)",
                  "Category (வகை)",
                  "Part No (பாகம் எண்)",
                  "Ward No (வார்டு எண்)",
                  "Area (பகுதி)",
                  "Address (முகவரி)",
                  "Phone (தொலைபேசி)",
                  "Aadhar No (ஆதார் எண்)",
                  "Voter ID (வாக்காளர் அட்டை)",
                  "Ration Card (ரேஷன் அட்டை)",
                  "Rental House (வாடகை வீடு)",
                  "House Owner (வீட்டு உரிமையாளர்)",
                  "Owner Contact (உரிமையாளர் தொலைபேசி)",
                  "Occupation (வேலை)",
                  "Scheme (அரசு திட்டம்)",
                  "Party (கட்சி)",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3.5 text-left font-semibold text-xs uppercase tracking-wider whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {paginatedData.map((v: any, idx: number) => (
                <tr
                  key={v.id}
                  className={`group transition-colors duration-100 hover:bg-blue-50/60 border-b ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <img
                      src={v.photo}
                      className="w-9 h-9 rounded-xl object-cover shadow-sm ring-1 ring-gray-100"
                    />
                  </td>

                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                    {v.voterName}
                  </td>

                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                    {v.rollNo}
                  </td>

                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                      {v.gender}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                      {v.age}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {v.category?.name}
                  </td>

                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {v.part?.name}
                  </td>

                  <td className="px-4 py-3 text-gray-600">{v.ward?.wardNo}</td>

                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {v.area?.name}
                  </td>

                   <td
                    className="px-4 py-3 text-gray-500 max-w-[180px]"
                    title={v.address}
                  >
                    {v.address}
                  </td>

                  <td className="px-4 py-3 text-gray-600 font-mono text-xs whitespace-nowrap">
                    {v.phone}
                  </td>

                  <td className="px-4 py-3 text-gray-600 font-mono text-xs whitespace-nowrap">
                    {v.aadharNumber}
                  </td>

                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                      {v.voterId}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                    {v.rationCardNumber}
                  </td>

                  <td className="px-4 py-3 text-gray-600">{v.rentalHouse}</td>

                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {v.houseOwnerName || "—"}
                  </td>

                  <td className="px-4 py-3 text-gray-600 font-mono text-xs whitespace-nowrap">
                    {v.houseOwnerContact || "—"}
                  </td>

                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {v.occupation}
                  </td>

                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {v.govtScheme}
                  </td>

                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold border border-violet-100 whitespace-nowrap">
                      {v.party}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer: count + pagination */}
        <div className="px-4 sm:px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">{startEntry}</span> –{" "}
            <span className="font-semibold text-gray-700">{endEntry}</span> of{" "}
            <span className="font-semibold text-gray-700">{voters.length}</span>{" "}
            voters
          </p>

          <div className="flex items-center gap-1.5">
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(1)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              «
            </button>
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Prev
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p: number;
                if (totalPages <= 5) {
                  p = i + 1;
                } else if (page <= 3) {
                  p = i + 1;
                } else if (page >= totalPages - 2) {
                  p = totalPages - 4 + i;
                } else {
                  p = page - 2 + i;
                }
                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      p === page
                        ? "bg-[var(--primary-color)] text-white shadow-sm shadow-[var(--primary-color)]/30"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
            >
              Next
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => handlePageChange(totalPages)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoterSearchResult;
