import React from "react";
import styled from "@emotion/styled";
import { Navigate, useNavigate } from "react-router-dom";

import Friend from "../component/FriendList/Friend";
import BottomNavigation from "../component/BottomNavigation";
import TopNavigation from "../component/TopNavigation";
import FriendList from "../component/FriendList";
import { useMutation, useQuery } from "react-query";
import { fetchMyProfile, fetchUserList } from "../apis/userApi";
import { AxiosError, AxiosResponse } from "axios";
import { IProfile, IRoom, IUser } from "../types";
import Profile from "../component/Profile";
import {
  fetchChatRoomList,
  makeChatRoom,
  MakeChatRoomRequest,
} from "../apis/roomApi";

const Base = styled.div``

const Container = styled.div``

const Summary = styled.div``

const Friends: React.FC = () => {

    const navigate = useNavigate();

    const {data: profileData} = useQuery<AxiosResponse<IProfile>,AxiosError>('fetchMyProfile', fetchMyProfile)

    const { data: userData } = useQuery<AxiosResponse<{count: number; rows: Array<IUser>}>,AxiosError>('fetchUserList', fetchUserList)

    const mutation = useMutation('makeChatRoom', (request: MakeChatRoomRequest) => 
        makeChatRoom(request)
    );

    const { data: chatRoomListData } = useQuery<AxiosResponse<Array<IRoom>>, AxiosError>('fetchChatRoomList', fetchChatRoomList)

    const handleChatRoomCreate = (opponentId: string) => {
        const chatRoom = chatRoomListData?.data.find(chatRoom => chatRoom.opponentId === opponentId);

        if (chatRoom) {
            navigate(`/rooms/${chatRoom.id}`);
          } else {
            mutation.mutate(
              {
                opponentId,
              },
              {
                onSuccess: (data) => {
                  navigate(`/rooms/${data.data.id}`);
                },
              }
            );
          }
        };
        
    return(
        <Base>
            <Container>
                <TopNavigation title="친구" />

                {profileData && <Profile username={profileData.data.username} />}
                {
                    userData && (
                        <>
                            <Summary> 친구: {userData.data.count}</Summary>
                            <FriendList>
                                {
                                    userData.data.rows.map(row => (
                                        <Friend
                                            key = {row.id}
                                            username = {row.username}
                                            thumbnailImage = {row.thumbnailImageUrl}
                                            onClick={()=> handleChatRoomCreate(row.id)}
                                        />
                                    ))
                                }
                            </FriendList>
                        </>
                    )
                }
                <BottomNavigation />
            </Container>
        </Base>
    )
}

export default Friends;