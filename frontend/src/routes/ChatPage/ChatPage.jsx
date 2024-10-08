import "./ChatPage.css";
import NewPrompt from "../../components/NewPrompt/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";
import useAuthFetch from "../../hooks/authenticatedFetchHook";

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  const authFetch = useAuthFetch()

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      authFetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {isPending
            ? "Loading..."
            : error
            ? "Something went wrong!"
            : data?.history?.map((message, i) => (
                <div
                  key={i}
                  className={
                    message.role === "user" ? "message user" : "message"
                  }
                >
                  {message.img && (
                    <IKImage
                      urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                      path={message.img}
                      loading="lazy"
                      lqip={{ active: true, quality: 20 }}
                    />
                  )}
                  {message.parts && message.parts[0].text && (
                    <Markdown>{message.parts[0].text}</Markdown>
                  )}
                </div>
              ))}

          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
