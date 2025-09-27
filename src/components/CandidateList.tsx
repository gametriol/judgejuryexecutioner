// src/components/CandidateList.tsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  Users,
  GraduationCap,
  RefreshCw,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CandidateCard } from "./CandidateCard";
import { CandidateDetail } from "./CandidateDetail";
import { Candidate, FilterOptions } from "@/types/candidate";

interface CandidateListProps {
  candidates: Candidate[];
  loading?: boolean;
}

export const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  loading = false,
}) => {
  const searchDebounceRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        window.clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    branch: "",
    year: "",
    society: "",
  });

  const itemsPerPage = 9; // Reduced to 9 for better display with larger cards (3x3 grid)

  // Memoized filtering and pagination logic
  const {
    filteredCandidates,
    stats,
    uniqueBranches,
    uniqueYears,
    uniqueSocieties,
  } = useMemo(() => {
    let filtered = candidates.filter((candidate) => {
      const searchMatch =
        candidate.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        candidate.rollNo.toLowerCase().includes(filters.search.toLowerCase()) ||
        candidate.email.toLowerCase().includes(filters.search.toLowerCase());

      const branchMatch =
        !filters.branch || candidate.branch === filters.branch;
      const yearMatch = !filters.year || candidate.year === filters.year;
      const societyMatch =
        !filters.society || candidate.society === filters.society;

      return searchMatch && branchMatch && yearMatch && societyMatch;
    });

    const uniqueBranches = Array.from(
      new Set(candidates.map((c) => c.branch))
    ).sort();
    const uniqueYears = Array.from(
      new Set(candidates.map((c) => c.year))
    ).sort();
    const uniqueSocieties = Array.from(
      new Set(candidates.map((c) => c.society).filter((s) => s !== "N/A"))
    ).sort();

    return {
      filteredCandidates: filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
      stats: {
        total: candidates.length,
        filtered: filtered.length,
        branches: uniqueBranches.length,
        societies: uniqueSocieties.length,
      },
      uniqueBranches,
      uniqueYears,
      uniqueSocieties,
    };
  }, [candidates, filters, currentPage]);

  const totalPages = Math.ceil(stats.filtered / itemsPerPage);

  // Handle filter changes
  const handleFilterChange = (
    filterType: keyof FilterOptions,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ search: "", branch: "", year: "", society: "" });
    setCurrentPage(1);
  };

  // Handle page navigation
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Refresh data
  const handleRefresh = () => {
    window.location.reload();
  };

  if (selectedCandidate) {
    return (
      <CandidateDetail
        candidate={selectedCandidate}
        onBack={() => setSelectedCandidate(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2 px-6 py-4">
              <Users className="h-7 w-7 text-blue-600 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Candidates
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.total}
                </p>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2 px-6 py-4">
              <GraduationCap className="h-7 w-7 text-green-600 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Branches
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.branches}
                </p>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2 px-6 py-4">
              <Filter className="h-7 w-7 text-purple-600 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Filtered Results
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.filtered}
                </p>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2 px-6 py-4">
              <Users className="h-7 w-7 text-orange-600 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Societies
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.societies}
                </p>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-sm hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Search Bar (accessible, debounced) */}
              <div className="relative">
                <label htmlFor="candidate-search" className="sr-only">
                  Search candidates
                </label>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="candidate-search"
                  type="search"
                  aria-label="Search candidates by name, roll number or email"
                  placeholder="Search by name, roll number, or email..."
                  defaultValue={filters.search}
                  onChange={(e) => {
                    const v = e.target.value;
                    // debounce user input for 250ms
                    if (searchDebounceRef.current) window.clearTimeout(searchDebounceRef.current);
                    searchDebounceRef.current = window.setTimeout(() => {
                      handleFilterChange("search", v);
                    }, 250);
                  }}
                  className="pl-12 h-14 text-base border-2 focus:border-blue-500 transition-colors w-full rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                {/* Clear button */}
                {filters.search && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                      if (searchDebounceRef.current) window.clearTimeout(searchDebounceRef.current);
                      handleFilterChange("search", "");
                      // also clear the input value in DOM
                      const el = document.getElementById("candidate-search") as HTMLInputElement | null;
                      if (el) el.value = "";
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* live region for screen-readers announcing count changes */}
              <div aria-live="polite" className="sr-only">
                {stats.filtered} candidates match your filters
              </div>

              {/* Filter Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="filter-branch" className="sr-only">Filter by branch</label>
                  <select
                    id="filter-branch"
                    value={filters.branch}
                    onChange={(e) => handleFilterChange("branch", e.target.value)}
                    className="h-12 border-2 border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 w-full px-3"
                  >
                    <option value="">All Branches</option>
                    {uniqueBranches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="filter-year" className="sr-only">Filter by year</label>
                  <select
                    id="filter-year"
                    value={filters.year}
                    onChange={(e) => handleFilterChange("year", e.target.value)}
                    className="h-12 border-2 border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 w-full px-3"
                  >
                    <option value="">All Years</option>
                    {uniqueYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="filter-society" className="sr-only">Filter by society</label>
                  <select
                    id="filter-society"
                    value={filters.society}
                    onChange={(e) => handleFilterChange("society", e.target.value)}
                    className="h-12 border-2 border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 w-full px-3"
                  >
                    <option value="">All Societies</option>
                    {uniqueSocieties.map((society) => (
                      <option key={society} value={society}>
                        {society}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="h-12 px-6 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(filters.search ||
              filters.branch ||
              filters.year ||
              filters.society) && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Active Filters:
                </p>
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <Badge variant="secondary" className="px-3 py-1.5 text-sm">
                      Search: "{filters.search}"
                    </Badge>
                  )}
                  {filters.branch && (
                    <Badge variant="secondary" className="px-3 py-1.5 text-sm">
                      Branch: {filters.branch}
                    </Badge>
                  )}
                  {filters.year && (
                    <Badge variant="secondary" className="px-3 py-1.5 text-sm">
                      Year: {filters.year}
                    </Badge>
                  )}
                  {filters.society && (
                    <Badge variant="secondary" className="px-3 py-1.5 text-sm">
                      Society: {filters.society}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Showing {filteredCandidates.length} of {stats.filtered} candidates
            </p>
            {currentPage > 1 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>

        {/* Candidate Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6 max-w-sm mx-auto shadow-sm min-h-[480px]">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="h-32 w-32 bg-gray-300 dark:bg-gray-700 rounded-full ring-4 ring-gray-200 dark:ring-gray-600"></div>
                    <div className="space-y-2 text-center">
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-40"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-28"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-3">
                      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-24 mx-auto"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCandidates.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Users className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                No candidates found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Try adjusting your search criteria or filters to find candidates
              </p>
              <Button onClick={clearFilters} size="lg">
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
            {filteredCandidates.map((candidate) => (
              <CandidateCard
                key={candidate._id}
                candidate={candidate}
                onClick={() => setSelectedCandidate(candidate)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 w-full sm:w-auto"
            >
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: Math.min(totalPages, 7) }).map(
                (_, index) => {
                  let pageNumber;
                  if (totalPages <= 7) {
                    pageNumber = index + 1;
                  } else if (currentPage <= 4) {
                    pageNumber = index + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNumber = totalPages - 6 + index;
                  } else {
                    pageNumber = currentPage - 3 + index;
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={
                        currentPage === pageNumber ? "default" : "outline"
                      }
                      onClick={() => handlePageChange(pageNumber)}
                      className="px-4 py-3 min-w-[48px]"
                    >
                      {pageNumber}
                    </Button>
                  );
                }
              )}
            </div>

            <Button
              variant="outline"
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-6 py-3 w-full sm:w-auto"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
