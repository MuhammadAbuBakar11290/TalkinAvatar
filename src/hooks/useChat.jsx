import { createContext, useContext, useEffect, useState } from "react";

// Define audio and transcript file names
const filePrefixes = {
  "1.introduce": {
    audio: "Q1.wav",
    transcript: "Q1.json",
  },
  "2.What is Deriv": {
    audio: "Q2.wav",
    transcript: "Q2.json",
  },
  "3.platforms": {
    audio: "Q3.wav",
    transcript: "Q3.json",
  },
  "4.: What assets can I trade on Deriv": {
    audio: "Q4.wav",
    transcript: "Q4.json",
  },
  "5.customer satisfaction": {
    audio: "Q5.wav",
    transcript: "Q5.json",
  },
  "6.Support innovation": {
    audio: "Q6.wav",
    transcript: "Q6.json",
  },
  "7.fintech industry": {
    audio: "Q7.wav",
    transcript: "Q7.json",
  },
  "8.cryptocurrencies": {
    audio: "Q8.wav",
    transcript: "Q8.json",
  },
  "9.Where is Deriv located": {
    audio: "Q9.wav",
    transcript: "Q9.json",
  },
  "10.apart from its competitors": {
    audio: "Q10.wav",
    transcript: "Q10.json",
  },
  "11. How long has Deriv been in operation": {
    audio: "Q11.wav",
    transcript: "Q11.json",
  },
  "12.trading platforms ": {
    audio: "Q12.wav",
    transcript: "Q12.json",
  },
  "13.What markets can I trade on Deriv": {
    audio: "Q13.wav",
    transcript: "Q13.json",
  },
  "14.personal data safe ": {
    audio: "Q14.wav",
    transcript: "Q14.json",
  },
  "15.Deriv a trustworthy": {
    audio: "Q15.wav",
    transcript: "Q15.json",
  },
  "16.Deriv's core values": {
    audio: "Q16.wav",
    transcript: "Q16.json",
  },
  "7.sorry": {
    audio: "sorry.wav",
    transcript: "sorry.json",
  },
};

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [message, setMessage] = useState(null);

  // Fetch base64 encoded audio file
  const getBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Fetch JSON transcript
  const fetchJson = async (url) => {
    const response = await fetch(url);
    return response.json();
  };

  // Process user chat message
  const chat = async (userMessage) => {
    setLoading(true);

    let filePrefix = "7.sorry";

    if (userMessage && userMessage.trim() !== "") {
      const messageLowerCase = userMessage.toLowerCase();
  
      // Matching user input with specific questions
      if (messageLowerCase.includes("introduce") || messageLowerCase.includes("yourself")) {
        filePrefix = "1.introduce";
      } else if (messageLowerCase.includes("what is deriv")) {
        filePrefix = "2.What is Deriv";
      } else if (messageLowerCase.includes("platforms")) {
        filePrefix = "3.platforms";
      } else if (messageLowerCase.includes("assets") || messageLowerCase.includes("trade")) {
        filePrefix = "4.: What assets can I trade on Deriv";
      } else if (messageLowerCase.includes("customer satisfaction")) {
        filePrefix = "5.customer satisfaction";
      } else if (messageLowerCase.includes("support innovation")) {
        filePrefix = "6.Support innovation";
      } else if (messageLowerCase.includes("fintech") || messageLowerCase.includes("industry")) {
        filePrefix = "7.fintech industry";
      } else if (messageLowerCase.includes("cryptocurrencies")) {
        filePrefix = "8.cryptocurrencies";
      } else if (messageLowerCase.includes("where is deriv located") || messageLowerCase.includes("location")) {
        filePrefix = "9.Where is Deriv located";
      } else if (messageLowerCase.includes("apart") || messageLowerCase.includes("competitors")) {
        filePrefix = "10.apart from its competitors";
      } else if (messageLowerCase.includes("how long") || messageLowerCase.includes("operation")) {
        filePrefix = "11. How long has Deriv been in operation";
      } else if (messageLowerCase.includes("trading platforms")) {
        filePrefix = "12.trading platforms ";
      } else if (messageLowerCase.includes("what markets") || messageLowerCase.includes("trade")) {
        filePrefix = "13.What markets can I trade on Deriv";
      } else if (messageLowerCase.includes("personal data") || messageLowerCase.includes("safe")) {
        filePrefix = "14.personal data safe ";
      } else if (messageLowerCase.includes("trustworthy")) {
        filePrefix = "15.Deriv a trustworthy";
      } else if (messageLowerCase.includes("core values")) {
        filePrefix = "16.Deriv's core values";
      }
      else {
        filePrefix = "7.sorry";
    }
  }
    const fileName = filePrefixes[filePrefix];
    const audioUrl = `./audios/${fileName.audio}`;
    const transcriptUrl = `./audios/${fileName.transcript}`;

    try {
      const audio = await getBase64(audioUrl);
      const lipsync = await fetchJson(transcriptUrl);
    
      const message = {
        text: filePrefix === "7.sorry" ? "Sorry, I am unable to answer it. Do you want to know more about Deriv?" : `Playing audio for ${filePrefix.replace(/\d\./, '').replace(/\./g, ' ')}`,
        audio,
        lipsync,
        facialExpression: "smile",
        animation: "Idle",
      };
    
      setMessages((prevMessages) => [...prevMessages, message]);
    } catch (error) {
      console.error("Error fetching audio or transcript:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "An error occurred while processing your request." },
      ]);
    } finally {
      setLoading(false);
    }
  }    

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  const onMessagePlayed = () => {
    setMessages((prevMessages) => prevMessages.slice(1));
  };

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
