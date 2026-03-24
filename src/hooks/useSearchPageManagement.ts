import { useCallback, useMemo, useState } from "react";
import type { Shift, User } from "../../types";

export type SearchType = "all" | "incident" | "announcement";
type SeverityFilter = "all" | "low" | "medium" | "high";

type IncidentResult = {
  id: string;
  type: "incident";
  title: string;
  content: string;
  severity: "low" | "medium" | "high";
  status: "open";
  shift: Shift;
  author: string;
  createdAt: string;
  department: string;
};

type AnnouncementResult = {
  id: string;
  type: "announcement";
  title: string;
  content: string;
  author: string;
  createdAt: string;
  department: string;
};

type SearchResult = IncidentResult | AnnouncementResult;

export function useSearchPageManagement(user: User) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("all");
  const [selectedShift, setSelectedShift] = useState<Shift | "all">("all");
  const [selectedSeverity, setSelectedSeverity] =
    useState<SeverityFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  const searchResults = useMemo<SearchResult[]>(
    () => [
      {
        id: "1",
        type: "incident",
        title: "機械異常音発生",
        content:
          "ライン2の機械から異常音が発生しています。すぐに点検が必要です。",
        severity: "high",
        status: "open",
        shift: "2勤",
        author: "作業者A",
        createdAt: "2024-12-20 14:30",
        department: user.department,
      },
      {
        id: "2",
        type: "announcement",
        title: "来週の保守点検について",
        content:
          "来週月曜日から水曜日まで、機械の定期保守点検を実施します。",
        author: "保守担当 佐藤",
        createdAt: "2024-12-20 16:00",
        department: user.department,
      },
    ],
    [user.department]
  );

  const filteredResults = useMemo(() => {
    return searchResults.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = searchType === "all" || item.type === searchType;
      const matchesShift =
        selectedShift === "all" ||
        ("shift" in item && item.shift === selectedShift);
      const matchesSeverity =
        selectedSeverity === "all" ||
        ("severity" in item && item.severity === selectedSeverity);

      return matchesSearch && matchesType && matchesShift && matchesSeverity;
    });
  }, [searchResults, searchTerm, searchType, selectedSeverity, selectedShift]);

  const getTypeIcon = useCallback((type: string) => {
    switch (type) {
      case "incident":
        return "🚨";
      case "announcement":
        return "📢";
      default:
        return "🔍";
    }
  }, []);

  const getTypeText = useCallback((type: string) => {
    switch (type) {
      case "incident":
        return "異常報告";
      case "announcement":
        return "部署連絡";
      default:
        return "不明";
    }
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  return {
    state: {
      searchTerm,
      searchType,
      selectedShift,
      selectedSeverity,
      showFilters,
    },
    data: {
      filteredResults,
    },
    utils: {
      getTypeIcon,
      getTypeText,
    },
    actions: {
      setSearchTerm,
      setSearchType,
      setSelectedShift,
      setSelectedSeverity,
      toggleFilters,
    },
  };
}

