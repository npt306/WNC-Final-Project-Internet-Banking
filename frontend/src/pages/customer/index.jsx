import React, { useEffect, useState } from "react";
import useSocket from "../../hooks/useSocket";
import { Input, Button, Card } from "antd";
import { useSelector } from "react-redux";
const App = () => {
  const [myId, setMyId] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const { state, initialize, send } = useSocket();
  const profile = useSelector((state) => state.profile);


  useEffect(() => {
    initialize(profile._id);
  }, [profile._id]);
  const handleSend = () => {
    if (recipientId) {
      send(recipientId);
    }
  };

  return (
    <div className="p-8">
      <Card title="Socket Test" className="max-w-md mx-auto">
        <div className="space-y-4">
          {/* ID người gửi */}
          <div>
            <label className="block mb-2">ID Người Gửi:</label>
            <Input
              value={myId}
              onChange={(e) => setMyId(e.target.value)}
              placeholder="Nhập ID của bạn"
              className="mb-2"
            />

          </div>

          {/* ID người nhận */}
          <div>
            <label className="block mb-2">ID Người Nhận:</label>
            <Input
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              placeholder="Nhập ID người nhận"
              className="mb-2"
            />
            <Button type="primary" onClick={handleSend}>
              Gửi
            </Button>
          </div>

          {/* Hiển thị state */}
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p className="font-bold">Socket State:{state}</p>
            <p>{state ? "Connected" : "Disconnected"}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default App;
