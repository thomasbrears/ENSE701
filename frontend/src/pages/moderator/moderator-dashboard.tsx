
import { GetStaticProps, NextPage } from "next";
import axios from "axios";
import SortableTable from "../../components/SortableTable";
import { useRouter } from "next/router";

async function getModerationList() {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/moderation");

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

    return articles;
  } catch (error) {
    console.error("Error fetching moderation:", error);
    return [];
  }
}

export const getStaticProps: GetStaticProps<ArticlesProps> = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/moderation");

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
    console.error("Error fetching moderation:", error);
    return {
      props: {
        articles: [], // Return an empty array if there's an error
      },
    };
  }
};

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
  const router = useRouter();

  async function handleReject(row: any) {
    console.log(`Reject ${row.id}`)
    try {
      const response = await axios.post("http://localhost:8000/api/moderation/reject/" + row.id)
      if (response.status == 201) {
        alert(`Reject ${row.id}`);
        router.reload();
      }
    } catch (error) {
      console.error("Error reject article:", error);
      alert("Failed to handle Reject. Please try again.");
    }
  }

  async function handlePass(row: any) {
    try {
      const response = await axios.post("http://localhost:8000/api/moderation/pass/" + row.id)
      if (response.status == 201) {
        alert(`Pass ${row.id}`);
        router.reload();
      }
    } catch (error) {
      console.error("Error pass article:", error);
      alert("Failed to handle Reject. Please try again.");
    }
  }

  const handleDetail = async (id: any) => {
    router.push({
      pathname: '/articles/article-detail',
      query: { id }
    });
  };

  const customOperation = (row: any) => (
    <td width={240}>
      <button style={{
        marginRight: '10px'
      }} onClick={() => handleDetail(row.id)}>Detail</button>
      <button style={{
        marginRight: '10px'
      }} onClick={() => handlePass(row)}>Pass</button>
      <button onClick={() => handleReject(row)}>Reject</button>
    </td>
  );

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
        <h1>Moderator Dashboard</h1>
        <p>Welcome to the Moderator Dashboard Page</p>
        <SortableTable headers={headers} data={articles} renderOperation={customOperation} />
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

export default AllArticles;


