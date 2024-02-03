import React, { useCallback, useEffect, useState } from 'react';

import { io } from "socket.io-client";

const socket = io('/');

enum EventType {
  ConnectUserCount = "connectUserCount"
}

function App() {
  const [count, setCount] = useState(1);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<string>>([]);

  const sendMessage = () => {
    socket.emit("message", { message: `From connection ${socket.id} ${input}` });
    setInput("");
  }

  useEffect(() => {
    socket.on(EventType.ConnectUserCount, (event) => {
      setCount(event.count);
    })
    socket.on("message", (event) => {
      setMessages([...messages, event.message]);
    })

    return () => {
      socket.removeListener(EventType.ConnectUserCount);
      socket.removeListener("message");
    }
  }, [count, messages])
  

  const reversedMessages = [...messages].reverse();

  return (
    <div className="m-auto p-20">
      <div className="text-3xl text-red-800">
        Connect User Count: {count}
      </div>
      <div className="pt-5">
        <input value={input} onChange={e => setInput(e.target.value)} className="bg-slate-200 rounded-xl p-2" placeholder='Enter message'/>
        <button className="p-2 px-4 border-gray-100 rounded-xl bg-blue-500 text-white" onClick={sendMessage}>Send</button>
      </div>

      <div className="flex flex-col">
        {reversedMessages.map(msg => <p>{msg}</p>)}
      </div>
    </div>
  );
}

export default App;
