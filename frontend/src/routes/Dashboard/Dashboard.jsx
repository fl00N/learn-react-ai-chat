import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Dashboard.css";
import useAuthFetch from "../../hooks/authenticatedFetchHook";

const Dashboard = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const options = [
    { label: "Tell me a story", icon: "/chat.png", question: "Tell me a story" },
    { label: "Analyze Images", icon: "/image.png", question: "Analyze these images" },
    { label: "Help me with my Code", icon: "/code.png", question: "Help me with my code" },
  ];

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const authFetch = useAuthFetch()

  const mutation = useMutation({
    mutationFn: (text) => {
      return authFetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (id, variables) => {
      navigate(`/dashboard/chats/${id}`, { state: { question: variables } });
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
    },
  });

  const triggerQuestion = (question) => {
    mutation.mutate(question);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    mutation.mutate(text);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 570);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" />
        </div>
        <div className="options">
          {options.map((option, index) => {
            if (isSmallScreen && option.label === "Help me with my Code") return null;
            return (
              <div
                className="option"
                key={index}
                onClick={() => triggerQuestion(option.question)}
              >
                <img src={option.icon} alt={option.label} />
                <span>{option.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder="Ask me anything..." autoComplete="off" />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
