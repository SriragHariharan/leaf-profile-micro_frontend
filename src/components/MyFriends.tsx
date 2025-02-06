import React, { useEffect, useState } from 'react'
import InfoCard from './InfoCard'
import useAxiosInstance from '../axios/axiosInstance';
import { User } from '../interfaces/User.interface';
import UserCard from './UserCard';

function MyFriends() {
    const axiosInstance = useAxiosInstance();
    const [friendsArray, setFriendsArray] = useState<User[]>([]);
    useEffect(() => {
        axiosInstance.get("friend/friends?page=1")
        .then(resp => setFriendsArray(resp?.data?.data?.friends))
        .catch(err => console.log(err));
    },[]);
    console.log(friendsArray[0])
  return (
    <div>
        {
            friendsArray?.length > 0 ? 
                ( friendsArray.map(user => <UserCard user={user?.friendProfile} key={user?.userID} /> )  ) 
                : <InfoCard message='No friends found. Add more friends 🙂' />
        }

    </div>
  )
}

export default MyFriends