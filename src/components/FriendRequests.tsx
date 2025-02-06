import React, { useEffect, useState } from 'react'
import InfoCard from './InfoCard'
import useAxiosInstance from '../axios/axiosInstance';
import { User } from '../interfaces/User.interface';
import UserCard from './UserCard';

function FriendRequests() {
    const axiosInstance = useAxiosInstance();
    const [friendRequests, setFriendRequests] = useState<User[]>([]);
    console.log(friendRequests[0]);
    /* fetch friend requests from server */
    useEffect(() => {
        axiosInstance.get("/friend/request")
        .then(resp => setFriendRequests(resp?.data?.data?.friendRequests))
        .catch(err => console.log(err));
    }, []);
  return (
    <div>
        {
            friendRequests?.length > 0 ? (
                friendRequests?.map((user) => ( <UserCard user={user?.Profile} /> ))
            ) : (<InfoCard message='No New Friend Requests.' />)
        }
    </div>
  )
}

export default FriendRequests