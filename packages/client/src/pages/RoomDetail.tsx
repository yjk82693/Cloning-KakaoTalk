import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { Global, css } from "@emotion/react";
import { io } from "socket.io-client";

import TopNavigation from "../component/ChatRoomDetail/TopNavigation";
import InputChat from "../component/ChatRoomDetail/InputChat";
import MessageList from "../component/ChatRoomDetail/MessageList";
import { useMutation, useQuery } from 'react-query';
import { fetchChatRoomDetail } from "../apis/roomApi";
import { AxiosError, AxiosResponse} from "axios";
import { IChat, IRoom, IProfile } from "../types";
import { fetchChatMessageList, sendChatMessage } from "../apis/chatApi";
import SentMessage from "../component/ChatRoomDetail/SentMessage";
import ReceivedMessage from "../component/ChatRoomDetail/ReceivedMessage";
import dayjs from "dayjs";
import {fetchMyProfile} from "../apis/userApi"

const globalStyles = css`
  body {
    background-color: #abc1d1;
  }
`;

const Base = styled.div`
  position: relative;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 64px;
  align-items: center;
  padding: 0 24px;
`;

const RoomDetailPage: React.FC = () => {
    const scrollBottomRef = useRef<HTMLLIElement>(null);
    const { roomId } = useParams<string>();
  
    const { data: profileData } = useQuery<AxiosResponse<IProfile>, AxiosError>(
      "fetchMyProfile",
      fetchMyProfile
    );
    const { data: chatRoomDetailData } = useQuery<
      AxiosResponse<IRoom>,
      AxiosError
    >(["fetchChatRoomDetail", roomId], () =>
      fetchChatRoomDetail(roomId as string)
    );
  
    const [messages, setMessages] = useState<Array<IChat>>([]);
  
    const { data: chatListData } = useQuery<
      AxiosResponse<Array<IChat>>,
      AxiosError
    >(["fetchChatMessageList", roomId, messages], () =>
      fetchChatMessageList(roomId as string)
    );
  
    const mutation = useMutation("sendChatMessage", (content: string) =>
      sendChatMessage(roomId as string, content)
    );
  
    const handleSend = (content: string) => {
      if (content.length) {
        mutation.mutate(content);
      }
    };
  
    useEffect(() => {
      const socket = io("https://localhost:8000", { path: "/socket.io" });
  
      socket.emit("join", roomId);
  
      socket.on("chat", (newMessage: IChat) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }, []);
  
    useEffect(() => {
      scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
  
    return (
      <Base>
        <Global styles={globalStyles} />
        {chatRoomDetailData && (
          <TopNavigation title={chatRoomDetailData.data.user.username} />
        )}
        <Container>
          <MessageList>
            {chatListData?.data.map((message) =>
              message.senderId === profileData?.data.userId ? (
                <SentMessage
                  key={message.id}
                  senderId={message.senderId}
                  content={message.content}
                  timestamp={dayjs(message.createdAt).format("HH:mm")}
                />
              ) : (
                <ReceivedMessage
                  key={message.id}
                  receiver={message.user?.username}
                  receiverThumbnailImage={message.user?.thumbnailImageUrl}
                  senderId={message.senderId}
                  content={message.content}
                  timestamp={dayjs(message.createdAt).format("HH:mm")}
                />
              )
            )}
            <li ref={scrollBottomRef} />
          </MessageList>
        </Container>
        <InputChat onClick={handleSend} />
      </Base>
    );
  };
  
  export default RoomDetailPage;