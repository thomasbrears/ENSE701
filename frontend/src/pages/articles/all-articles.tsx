import { GetStaticProps, NextPage } from "next";
import axios from "axios";
import Link from "next/link";
import SortableTable from "../../components/SortableTable";

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
  const headers: { key: keyof ArticlesInterface | 'actions'; label: string }[] = [
    { key: "title", label: "Title" },
    { key: "authors", label: "Authors" },
    { key: "pubyear", label: "Publication Year" },
    { key: "journal", label: "Journal/Conference" },
    { key: "se_practice", label: "SE Practice" },
    { key: "research_type", label: "Research Type" },
    { key: "actions", label: "" }, // no label - for view button
  ];

  const tableData = articles.map(article => ({
    ...article,
    actions: (<Link href={`/articles/${article.id}`} passHref><button style={{ cursor: "pointer", padding: "0.5em 1em", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px" }}>View</button></Link>),}));

  return (
    <div>
      <div className="container">
        <h1>All Published Articles</h1>
        <p>Welcome to the SPEED database</p>
        <SortableTable headers={headers} data={tableData} />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<ArticlesProps> = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/articles/published");
    const articles = response.data.map((article: any) => ({
      id: article._id,
      title: article.title,
      authors: article.authors.join(", "),
      pubyear: article.publication_year.toString(),
      journal: article.journal ?? "", 
      se_practice: article.se_practice ?? "",
      research_type: article.research_type ?? "",
    }));

    return {
      props: {
        articles,
      },
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return {
      props: {
        articles: [], // Return an empty array if there's an error
      },
    };
  }
};

export default AllArticles;
