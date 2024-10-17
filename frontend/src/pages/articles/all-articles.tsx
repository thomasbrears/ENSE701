import { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import axios from "axios";
import Link from "next/link";
import 'react-toastify/dist/ReactToastify.css';
import SortableTable from "../../components/SortableTable";
import SearchBar from "../../components/SearchBar";
import ColumnCustomizationMenu from "../../components/ColumnCustomizationMenu";


interface ArticlesInterface {
  id: string;
  title: string;
  authors: string;
  pubyear: string;
  journal: string;
  se_practice: string;
  doi: string;
  research_type: string;
}

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://ense701-g6.vercel.app/api'
  : 'http://localhost:8000/api';

const AllArticles = () => {
  const [articles, setArticles] = useState<ArticlesInterface[]>([]);
  const [searchResults, setSearchResults] = useState<ArticlesInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Column customization state
  const availableColumns = [
    { key: "title", label: "Title" },
    { key: "authors", label: "Authors" },
    { key: "pubyear", label: "Publication Year" },
    { key: "journal", label: "Journal/Conference" },
    { key: "se_practice", label: "SE Practice" },
    { key: "research_type", label: "Research Type" },
    { key: "doi", label: "Source" },
    { key: "actions", label: "Actions" },  // action to display or hide the view button
  ];

  const [selectedColumns, setSelectedColumns] = useState<string[]>(availableColumns.map(col => col.key).concat("actions"));

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${API_URL}/articles/published`);
        const formattedArticles = response.data.map((article: any) => ({
          id: article._id,
          title: article.title,
          authors: Array.isArray(article.authors) ? article.authors.join(", ") : article.authors,
          pubyear: article.publication_year?.toString() ?? "",
          journal: article.journal ?? "",
          se_practice: article.se_practice ?? "",
          research_type: article.research_type ?? "",
          doi: article.doi ?? "",
        }));

        setArticles(formattedArticles);
        setSearchResults(formattedArticles);  // Initialize with full list
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast.error("Failed to load articles.");
        setError("Failed to load articles.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleSearch = (searchTerm: string) => {
    const trimmedTerm = searchTerm.trim().toLowerCase();

    if (trimmedTerm === "") {
      setSearchResults(articles);
      return;
    }

    const filteredArticles = articles.filter((article) => {
      const term = trimmedTerm;
      const titleMatch = article.title.toLowerCase().includes(term);
      const authorsMatch = article.authors.toLowerCase().includes(term);
      const pubYearMatch = article.pubyear.includes(term);

      return titleMatch || authorsMatch || pubYearMatch;
    });

    setSearchResults(filteredArticles);
  };

  const tableData = searchResults.map((article) => ({
    ...article,
    actions: (
      <Link href={`/articles/${article.id}`} passHref>
        <button
          style={{
            cursor: "pointer",
            padding: "0.5em 1em",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          View
        </button>
      </Link>
    ),
  }));

  return (
    <div>
      <div className="container">
        <SearchBar onSearch={handleSearch} />
        
        <ColumnCustomizationMenu
          availableColumns={availableColumns}
          selectedColumns={selectedColumns}
          onColumnChange={setSelectedColumns}
        />
        
        {isLoading ? (
          <p>Loading articles...</p>
        ) : error ? (
          <p>{error}</p>
        ) : searchResults.length > 0 ? (
          <SortableTable headers={availableColumns.filter(col => selectedColumns.includes(col.key))} data={tableData} />
        ) : (
          <p>No results found.</p>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AllArticles;
