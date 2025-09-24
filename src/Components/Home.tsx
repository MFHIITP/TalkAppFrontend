import React, { useEffect, useRef, useState } from "react";
import envConfig from "../config.js";
import { useNavigate } from "react-router-dom";
import isAuthenticated from "../utils/authenticates.js";
import api from "../api.js";
import allRoutes from "../Routes/RouterFrontend.routes.js";
import { useMutation, useQuery } from "@tanstack/react-query";

const logoutFunction = async () => {
  const { data } = await api.get(allRoutes.auth.logout);
  return data;
};

const getHistory = async (email: string) => {
  const { data } = await api.get(`${allRoutes.history.getHistory}/${email}`);
  return data.history;
};

const addHistory = async ({ email, messages, chatname }: { email: string; messages: { query: string; response: string }[]; chatname: string }) => {
  const { data } = await api.post(allRoutes.history.addHistory, {
    email: email,
    messages: messages,
    chatname: chatname,
  });
  return data;
};

const clearHistory = async (email: string) => {
  const { data } = await api.post(allRoutes.history.clearHistory, {
    email: email,
  });
  return data;
};

const deleteHistory = async({email, chatname}:{email: string, chatname: string}) => {
  const { data } = await api.post(allRoutes.history.deleteHistory, {
    email: email,
    chatname: chatname,
  })
  return data;
}

const getAllChats = async(chatname: string) => {
  const { data } = await api.post(allRoutes.chats.getChats, {
    chatname: chatname,
  })
  return data;
}

function Home() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ query: string; response: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState<true | false>(false);
  const [chatname, setChatName] = useState("");
  const navigate = useNavigate();

  const scrollBottomRef = useRef<HTMLDivElement | null>(null)

  const { mutate: handleLogoutMutation } = useMutation({
    mutationFn: () => logoutFunction(),
    onSuccess: (data) => {
      localStorage.clear();
      location.reload();
    },
    onError: (data) => {
      alert(data.response.data);
    },
  });

  const { mutate: addHistoryMutation } = useMutation({
    mutationFn: ({ email, messages, chatname }: { email: string; messages: { query: string; response: string }[]; chatname: string }) => addHistory({ email, messages, chatname }),
    onSuccess: (data) => {
      setMessages([]);
      setChatName("");
      refetch();
    },
    onError: (data) => {
      alert(data.response.data.message);
    },
  });

  const {mutate: getAllChatsMutation} = useMutation({
    mutationFn: (chatname: string) => getAllChats(chatname),
    onSuccess: ( data ) => {
      setMessages(data?.chats || []);
      setChatName(data.chatname || "");

      setTimeout(() => {
        scrollBottomRef.current?.scrollIntoView({behavior: 'auto'})
      }, 0);
    }
  })

  const {mutate: clearHistoryMutation} = useMutation({
    mutationFn: (email: string) => clearHistory(email),
    onSuccess: (data) => {
      refetch();
    },
  })

  const {mutate: deleteHistoryMutation} = useMutation({
    mutationFn: ({email, chatname}: {email: string, chatname: string}) => deleteHistory({email, chatname}),
    onSuccess: (data) => {
      refetch();
    },
    onError: (data) => {
      alert(data.response.data.message)
    }
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["getHistory"],
    queryFn: () => getHistory(localStorage.getItem("email") ?? ""),
    retry: false
  });

  const handleQueryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const apiKey = envConfig.API_KEY;
      const url = `${envConfig.API_URL}?key=${apiKey}`;

      const payload = {
        contents: [
          {
            parts: [{ text: query }],
          },
        ],
      };

      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await result.json();
      console.log(data);
      const generatedText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response generated.";

      const pointWiseResponse = generatedText
        .split("\n")
        .filter((line: string) => line.trim())
        .map((line: string, index: number) => `${index + 1}. ${line.trim()}`)
        .join("\n");

      setMessages((prev) => [...prev, { query, response: pointWiseResponse }]);
      setQuery("");
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prev) => [
        ...prev,
        { query, response: "An error occurred. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const isLogin = await isAuthenticated();
      setAuthenticated(isLogin);
    })();
  }, []);

  const handleClear = () => {
    setMessages([]);
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const goToSignUp = () => {
    navigate("/signup");
  };

  const handleChatSave = () => {
    if (!authenticated) {
      alert("Please login to save chats");
      return;
    }
    if (!chatname.trim()) {
      alert("Please enter a chatname");
      return;
    }
    if (messages.length === 0) {
      alert("No messages to save");
      return;
    }
    addHistoryMutation({
      email: localStorage.getItem("email") ?? "",
      messages: messages,
      chatname: chatname,
    });
  };

  const handleLogout = () => {
    handleLogoutMutation();
  };

  const getChatsHandle = (chatname: string | null) => {
    if(!chatname){
      alert("Chatname required");
      return;
    }
    getAllChatsMutation(chatname);
  }

  const handleClearHistory = () => {
    clearHistoryMutation(localStorage.getItem("email") ?? "");
  }

  const handleDeleteHistory = (chatname: string) => {
    deleteHistoryMutation({email: localStorage.getItem("email") ?? "", chatname: chatname});
  }

  const createNewChat = () => {
    setChatName("")
    setMessages([]);
  }

  return (
    <div className="main-container">
      <div className="history-container">
        {authenticated ? (
          <div>
            <h1>History</h1>
            {data?.length > 0 && data?.map((val, key) => (
              <li
                key={key}
                className={`p-2 rounded-md border border-gray-100 ${val.chatname == chatname ? 'bg-gray-100' : 'bg-gray-300'} hover:bg-gray-50 cursor-pointer transition`}
                onClick={() => getChatsHandle(val.chatname)}
              >
                <span className={`text-gray-700 text-sm font-medium relative flex justify-between `}>
                  {val.chatname}
                  <button
                  className="ml-2 text-red-500 bg-yellow-500 px-1 rounded-4xl hover:text-red-800"
                  title="Delete Chat"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteHistory(val.chatname);
                  }}
                >
                  &#128465;
                </button>
                </span>
              </li>
            ))}
            {data?.length == 0 && <div>No History Yet</div>}
          </div>
        ) : (
          <>Please Log In to view History</>
        )}
        <div className={`clearHistoryStyle ${authenticated ? '' : 'hidden'}`} onClick={handleClearHistory}>Clear History</div>
      </div>
      <div className="app-container relative">
        {!authenticated ? (
          <div className="absolute top-4 right-4 flex gap-3">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
              onClick={goToLogin}
            >
              Login
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
              onClick={goToSignUp}
            >
              Signup
            </button>
          </div>
        ) : (
          <div className="absolute top-4 right-4 flex gap-3 text-xs sm:text-[15px]">
            <button
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 text-teal-100 cursor-pointer"
              onClick={createNewChat}
            >
              New Chat
            </button>
            <button
              className="px-4 py-2 bg-red-300 rounded hover:bg-red-400 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
        <h1 className="flex justify-left">
          AI Content Generator {!authenticated ? <>(Temporary Chat)</> : <></>}
        </h1>
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className="message-box">
              <p>
                <strong>User:</strong> {msg.query}
              </p>
              <pre>
                <strong>AI:</strong> {msg.response}
              </pre>
            </div>
          ))}
          <div ref={scrollBottomRef}></div>
        </div>
        <div className="query-container">
          <textarea
            placeholder="Enter your query here..."
            value={query}
            onChange={handleQueryChange}
            className="query-input"
          ></textarea>
          <div className="button-container">
            <button
              onClick={handleSubmit}
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
            {authenticated && (
              <>
                <input
                  type="text"
                  placeholder="Enter name of Chat"
                  value={chatname}
                  onChange={(e) => setChatName(e.target.value)}
                  className="p-2 rounded-sm border border-amber-300 focus:border focus:border-amber-600 outline-none"
                />
                <div
                  onClick={handleChatSave}
                  className={`save-chat-button ${
                    loading || messages.length == 0
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  Save Chat
                </div>
              </>
            )}
            <button onClick={handleClear} className="clear-button">
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;  
