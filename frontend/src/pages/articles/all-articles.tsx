import { GetStaticProps, NextPage } from "next";
import axios from "axios";
import SortableTable from "../../components/SortableTable";

interface ArticlesInterface {
  id: string;
  title: string;
  authors: string;
  source: string;
  pubyear: string;
  doi: string;
  claim: string | null;  // Allow null values
  evidence: string;
}

type ArticlesProps = {
  articles: ArticlesInterface[];
};

const AllArticles: NextPage<ArticlesProps> = ({ articles }) => {
  const headers: { key: keyof ArticlesInterface; label: string }[] = [
    { key: "title", label: "Title" },
    { key: "authors", label: "Authors" },
    { key: "source", label: "Source" },
    { key: "pubyear", label: "Publication Year" },
    { key: "doi", label: "DOI" },
    { key: "claim", label: "Claim" },
    { key: "evidence", label: "Evidence" },
  ];

  return (
    <div>
      <div className="container">
        <h1>All Articles</h1>
        <p>Welcome to the SPEED database</p>
        <SortableTable headers={headers} data={articles} />
      </div>
    </div>
  );
};


export async function getArticleById(id: string) {
  const result = await axios.get("http://127.0.0.1:8000/api/articles/" + id).then(response => {
    const article: any = response.data;
    console.log("拿到的文章：", article);
    return article;
  });

  return result;
}


export async function getAvagerScore(id: string) {
  const result = await axios.get("http://127.0.0.1:8000/api/scores/average/" + id).then(response => {
    const average_score: any = response.data.average_score || 0;
    console.log("拿到的平均成绩：", average_score);
    return average_score;
  });

  return result;
}

export const getStaticProps: GetStaticProps<ArticlesProps> = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/articles");

    const articles = response.data.map((article: any) => ({
      id: article._id ?? null,
      title: article.title ?? null,
      authors: article.authors.join(", ") ?? null,
      source: article.source ?? null,
      pubyear: article.publication_year ?? null,
      doi: article.doi ?? null,
      claim: article.claim ?? null,
      evidence: article.evidence ?? null,
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
