import React from "react";
import styled from "@emotion/styled";

import ChatRoomList from "../component/ChatRoomList";
import ChatRoom from "../component/ChatRoomList/ChatRoom";
import BottomNavigation from "../component/BottomNavigation";
import TopNavigation from "../component/TopNavigation";
import { useQuery } from "react-query";
import {AxiosError, AxiosResponse} from "axios";
import { IRoom } from "../types";
import { fetchChatRoomList } from "../apis/roomApi";

const Base = styled.div`
  width: 100%;
  height: 100vh;
  padding: 0 12px;
  box-sizing: border-box;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const RoomList: React.FC = () => {
    const { data: chatRoomListData } = useQuery<AxiosResponse<Array<IRoom>>,AxiosError>("fetchChatRoomList", fetchChatRoomList);
    return(
        <Base>
            <Container>
                <TopNavigation title="채팅" />
                {chatRoomListData && (
                <ChatRoomList>
                    {chatRoomListData.data.map((chatRoom) => (
                    <ChatRoom
                        key={chatRoom.id}
                        id={chatRoom.id}
                        username={chatRoom.user.username}
                    />
                    ))}
                </ChatRoomList>
                )}
                <BottomNavigation />
            </Container>
        </Base>
    )
}

export default RoomList;