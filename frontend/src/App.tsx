import React, { useCallback, useEffect, useState } from 'react';

import { io } from "socket.io-client";

const socket = io('/');

enum EventType {
  ConnectUserCount = "connectUserCount"
}

type ColoredMsg = {
    author: string,
    content:  string,
    color: string,
}


function App() {

  const [randomColor, setRandomColor] = useState(generateRandomColor());

  function generateRandomColor() {
    // Generate a random hexadecimal color code
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }

  const [count, setCount] = useState(1);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<ColoredMsg>>([]);

  const sendMessage = () => {

  const coloredMessage = {
    author: `${socket.id?.slice(0, 4)}`,
    content:  `${input}`,
    color: randomColor,
  };

    socket.emit("message", { message: coloredMessage });
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
      <div style={{ color: randomColor }} className="text-3xl">
        Connected User : {socket.id?.slice(0, 4)}...
      </div>
      <div className="pt-5">
        <input value={input} onChange={e => setInput(e.target.value)} className="bg-slate-200 rounded-xl p-2" placeholder='Enter message'/>
        <button className="p-2 px-4 border-gray-100 rounded-xl bg-blue-500 text-white" onClick={sendMessage}>Send</button>
      </div>
      <br/>
      <div className="flex flex-col">
        {reversedMessages.map(msg => <>
          <p style={{color: msg.color}}>User {msg.author}:</p>
          <p>{msg.content}</p>
          <br/>
          </>)}
      </div>
    </div>
  );
}

export default App;
