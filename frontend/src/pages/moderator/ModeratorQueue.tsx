import React, { useEffect, useState } from 'react';
import { GetStaticProps, GetStaticPropsContext, NextPage } from "next";
import axios from 'axios';
import Link from 'next/link';
import SortableTable from '@/components/SortableTable';

//I stole ur UX formatting whoever did analyst, Thank you, it looked good :)
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

const ModeratorQueue: NextPage<ArticlesProps> = ({ articles }) => {

    const headers = [
        { key: "title", label: "Title" },
        { key: "authors", label: "Authors" },
        { key: "pubyear", label: "Publication Year" },
        { key: 'actions', label: 'Actions' },
    ];

    const tableData = articles.map((article) => ({
        ...article,
        authors: article.authors,
        actions: (
            <>
                <Link href={`/moderator/${article.id}`} passHref>
                    <button
                        style={{
                            cursor: 'pointer',
                            padding: '0.5em 1em',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            marginRight: '10px'
                        }}
                    >
                        Review
                    </button>
                </Link>
                <Link href={`/moderator/${article.id}`} passHref>
                    <button
                        style={{
                            cursor: 'pointer',
                            padding: '0.5em 1em',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            marginRight: '10px'
                        }}
                    >
                        Pass
                    </button>
                </Link>
                <Link href={`/moderator/${article.id}`} passHref>
                    <button
                        style={{
                            cursor: 'pointer',
                            padding: '0.5em 1em',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                        }}
                    >
                        Reject
                    </button>
                </Link>
            </>
        ),
    }));

    return (
        <div className="container">
            <h1>Moderator Queue</h1>
            {articles.length > 0 ? (
                <SortableTable headers={headers} data={tableData} />
            ) : (
                <p>No articles in the moderation queue.</p>
            )}
        </div>
    );
};



export const getStaticProps: GetStaticProps<ArticlesProps> = async (context: GetStaticPropsContext) => {
    try {
        const response = await axios.get(process.env.ACCESS_URL + `/api/moderation/moderationQueue`);
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
        console.error('Error fetching articles for moderation:', error);
        return {
            props: {
                articles: [],
            },
        };
    }
};


export default ModeratorQueue;
