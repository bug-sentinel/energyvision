import React, { useEffect, useState, forwardRef } from 'react';
import { sanityClient } from '../../../sanity.client';

interface DocumentProps {
  document: {
    author?: {
      _ref: string;
    };
  };
}

interface Article {
  _id: string;
  title: string;
}

const EditorPicksInput: React.ForwardRefRenderFunction<unknown, DocumentProps> = (props, _ref) => {
  const { document } = props;
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (document?.author?._ref) {
      sanityClient
        .fetch(
          `*[_type == "news" && references($authorId)]{
            _id,
            title
          }`,
          { authorId: document.author._ref }
        )
        .then((data: Article[]) => {
          setArticles(data);
        });
    }
  }, [document?.author?._ref]);

  return (
    <div>
      <h3>Articles by Author</h3>
      <ul>
        {articles.map((article) => (
          <li key={article._id}>{article.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default forwardRef(EditorPicksInput);
