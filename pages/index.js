import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import styles from "./index.module.css";
import { Configuration, OpenAIApi } from "openai";
import Question from "../components/Question";
import Response from "../components/Response";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default function Home() {
  const textRef = useRef(null);
  const submitRef = useRef(null);
  const idRef = useRef(0);
  const [result, setResult] = useState("");
  // const [typedLength, setTypedLength] = useState(0);
  const [chat, setChat] = useState([
    // {id: 1
    // author: "you" | "bot"
    // text: ""}
  ]);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();

    if (textRef.current.value === "") return;

    try {
      setIsLoading(true);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(textRef.current.value),
      });

      setChat((prev) => [
        ...prev,
        { id: idRef.current, author: "you", text: textRef.current.value },
      ]);

      idRef.current++;
      const data = await response.json();

      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.response.content);
      setChat((prev) => [
        ...prev,
        { id: idRef.current, author: "bot", text: data.response.content },
      ]);
      setIsLoading(false);
      idRef.current++;
    } catch (error) {
      console.error(error);
    }
  }

  console.log("render");

  const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      const tick = () => {
        savedCallback.current();
      };

      if (delay !== null) {
        let timerId = setInterval(tick, delay);
        return () => clearInterval(timerId);
      }
    }, [delay]);
  };

  // // delay를 건드려서 인터벌을 멈추는 방법
  // // delay 인자에 state ? delay : null 이런식으로 넣어주기

  return (
    <div>
      <Head>
        <title>GPT TEST</title>
        <link rel="icon" href="/dog.png" />
      </Head>
      <main className={styles.main}>
        <h3>TEST</h3>
        <form onSubmit={onSubmit}>
          <textarea
            ref={textRef}
            rows={6}
            type="text"
            name="textInput "
            placeholder="Enter codes"
          />
          <input type="submit" value="Submit" ref={submitRef} />
        </form>

        <div className={styles["chat-area"]}>
          {chat.map((el) =>
            el.author === "you" ? (
              <Question key={el.id} question={el.text} />
            ) : (
              <Response key={el.id} response={el.text} />
            )
          )}
          {isLoading && <p className={styles.loader}>로딩 중...</p>}
        </div>
      </main>
    </div>
  );
}
