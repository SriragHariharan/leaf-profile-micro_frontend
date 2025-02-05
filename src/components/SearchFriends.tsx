import React, { useState } from 'react'
import UserCard from './UserCard'
import InfoCard from './InfoCard'
import SearchBar from './SearchBar'
import useAxiosInstance from '../axios/axiosInstance'
import { User } from '../interfaces/User.interface'


function SearchFriends() {
    const axiosInstance = useAxiosInstance();
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState<User[]>([]);
  
    /* fetch users based on search query */
    const handleUserSearch = () => {
        console.log("searched query ::: ", search);
        axiosInstance.get("/friend/search?search="+search)
        .then(resp => setUsers(resp?.data?.data?.search))
        .catch(err => console.log(err));
    } 
  return (
    <>
      <div className="mb-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search people..."
            handleUserSearch={handleUserSearch}
          />
        </div>
      <div>
          {
              users.length > 0 ? ( users?.map(u => ( <UserCard key={u?.userID} user={u} /> ))) : <InfoCard message='No users were found based on your search' />
          }
      </div>
    </>
  )
}

export default SearchFriends