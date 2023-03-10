import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import styles from "../pages/index.module.css";

const Response = ({ response, typedLength, isLoading }) => {
  // <pre>에 해당하는 요소를 찾으면 위에 버튼 올려줘야 하는데 어떻게 하지
  const preRef = useRef([]);

  useEffect(() => {
    const copyCode = async () => {
      try {
        await navigator.clipboard.writeText(preTag.textContent);

        console.log(preTag, preTags);
      } catch (error) {
        console.log(error);
      }
    };
    const button = (
      <button className="copy-button" onClick={copyCode}>
        Copy
      </button>
    );

    console.log(preRef.current);
  }, []);

  return (
    <div className={styles.response}>
      <div className={styles[`bot-tag`]}>bot</div>
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");

            return !inline && match ? (
              <div ref={(el, i) => (preRef.current[i] = el)}>
                <SyntaxHighlighter
                  style={oneLight}
                  // PreTag="div"
                  language={match[1]}
                  children={String(children).replace(/\n$/, "")}
                  {...props}
                />
              </div>
            ) : (
              <code className={className ? className : ""} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {response}
      </ReactMarkdown>
    </div>
  );
};

export default React.memo(Response);
