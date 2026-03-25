import { useState } from "react";
import { FiLogOut, FiSearch, FiUser } from "react-icons/fi";
import home_bg from "../../assets/home_bg.jpg";
import LogoutModal from "../common/LogoutModel";
import { searchVotersAPI } from "../../services/service_page/search";
import VoterSearchResult from "./VoterSearchResult";
import LoadingOverlay from "../others/LoadingOverlay";

const SEARCH_TYPES = [
  { key: "category", label: "Category ((உள்ளாட்சி அமைப்பு))" },
  { key: "part_number", label: "Part Number (பாகம் எண்)" },
  { key: "ward", label: "Ward (வார்டு)" },
  { key: "area", label: "Area (பகுதி)" },
  { key: "voter_name", label: "Voter Name (வாக்காளர் பெயர்)" },
  { key: "address", label: "Address (முகவரி)" },
  { key: "aadhar", label: "Aadhar Number (ஆதார் எண்)" },
  { key: "ration_card", label: "Ration Card (ரேஷன் அட்டை)" },
  { key: "voter_id", label: "Voter ID (வாக்காளர் அட்டை)" },
  { key: "phone", label: "Phone Number (தொலைபேசி எண்)" },
];

const PLACEHOLDERS: Record<string, string> = {
  category: "Enter category...",
  part_number: "Enter part number...",
  ward: "Enter ward name...",
  area: "Enter area...",
  voter_name: "Enter voter name...",
  address: "Enter address...",
  aadhar: "Enter 12-digit Aadhar number...",
  ration_card: "Enter ration card number...",
  voter_id: "Enter voter ID...",
  phone: "Enter phone number...",
};

const Home = () => {
  const [showLogout, setShowLogout] = useState(false);
  const [activeType, setActiveType] = useState("category");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [voters, setVoters] = useState<any[]>([]);

  const userData = {
    firstName: localStorage.getItem("firstName"),
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const res = await searchVotersAPI(activeType, query, "", 1, 10);

      const data = res?.data || [];

      setVoters(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-100">
        {loading && <LoadingOverlay />}

        {/* Banner */}
        <div className="relative h-64 w-full overflow-hidden">
          <img
            src={home_bg}
            alt="banner"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/70 via-blue-800/40 to-transparent" />

          <div className="absolute inset-0 flex flex-col items-center justify-center pb-6 pointer-events-none">
            <h1 className="text-white text-2xl font-bold tracking-widest uppercase drop-shadow-lg">
              Voter Registry
            </h1>

            <p className="text-blue-200 text-xs tracking-[0.2em] uppercase mt-1 font-light">
              Search & Manage Records
            </p>
          </div>

          {/* User */}
          <div className="absolute top-4 right-5 flex items-center gap-2.5 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-4 py-2 text-white text-sm font-medium">
            <FiUser size={14} />
            <span>{userData?.firstName || "User"}</span>

            <div className="w-px h-4 bg-white/30" />

            <button
              onClick={() => setShowLogout(true)}
              className="text-red-500 hover:text-red-600"
            >
              <FiLogOut size={15} />
            </button>
          </div>
        </div>

        {/* Search Box */}
       <div className="relative -mt-20 flex justify-center px-4 z-10">
          <div className="bg-white rounded-2xl shadow-2xl shadow-blue-900/10 border border-slate-100 p-6 w-full max-w-2xl">
            <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3">
              Search by
            </p>

            {/* Search Types */}
            <div className="flex flex-wrap gap-2 mb-5">
              {SEARCH_TYPES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => {
                    setActiveType(t.key);
                    setQuery("");
                  }}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition
                    ${
                      activeType === t.key
                        ? "bg-[var(--primary-color)] text-white border-[var(--primary-color)]"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="flex gap-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={PLACEHOLDERS[activeType]}
                className="w-full pl-4 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent shadow-sm transition"
              />

              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex items-center gap-2 bg-[var(--primary-color)] text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
              >
                <FiSearch size={14} />
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH RESULTS */}

        {/* {voters.length > 0 && ( */}
        <div className="mt-10 px-6 pb-10">
          <VoterSearchResult voters={voters} type={activeType} query={query} />
        </div>
        {/* )} */}
      </div>

      <LogoutModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Home;
