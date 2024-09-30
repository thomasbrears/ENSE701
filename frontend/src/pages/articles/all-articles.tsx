import { GetStaticProps, NextPage } from "next";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import SortableTable from "../../components/SortableTable";
import SearchBar from "../../components/SearchBar";

interface ArticlesInterface {
  id: string;
  title: string;
  authors: string;
  pubyear: string;
  journal: string;
  se_practice: string;
  research_type: string;
}

type ArticlesProps = {
  articles: ArticlesInterface[];
};

const AllArticles: NextPage<ArticlesProps> = ({ articles }) => {
  const [searchResults, setSearchResults] = useState<ArticlesInterface[]>(articles);

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

  const headers: { key: keyof ArticlesInterface | "actions"; label: string }[] = [
    { key: "title", label: "Title" },
    { key: "authors", label: "Authors" },
    { key: "pubyear", label: "Publication Year" },
    { key: "journal", label: "Journal/Conference" },
    { key: "se_practice", label: "SE Practice" },
    { key: "research_type", label: "Research Type" },
    { key: "actions", label: "Actions" },
  ];

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
        <h1>All Published Articles</h1>
        <SearchBar onSearch={handleSearch} />
        {searchResults.length > 0 ? (
          <SortableTable headers={headers} data={tableData} />
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<ArticlesProps> = async () => {
  try {
    const response = await axios.get(process.env.ACCESS_URL + `/api/articles/published`);
    const articles = response.data.map((article: any) => ({
      id: article._id,
      title: article.title,
      authors: Array.isArray(article.authors) ? article.authors.join(", ") : article.authors,
      pubyear: article.publication_year?.toString() ?? "",
      journal: article.journal ?? "",
      se_practice: article.se_practice ?? "",
      research_type: article.research_type ?? "",
      summary: article.summary ?? "",
    }));

    return {
      props: {
        articles,
      },
      revalidate: 60, // Optional: Regenerate the page every 60 seconds
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return {
      props: {
        articles: [],
      },
    };
  }
};

export default AllArticles;
