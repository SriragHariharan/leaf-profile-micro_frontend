import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';
import '../index.scss';

interface User {
  id: string;
  name: string;
  avatar: string;
  isFriend: boolean;
  description: string;
}


const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe 01',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    description: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
    isFriend: true,
  },{
    id: '2',
    name: 'John Doe 02',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    description: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
    isFriend: true,
  },{
    id: '3',
    name: 'John Doe 03',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    description: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
    isFriend: false,
  },{
    id: '4',
    name: 'John Doe 04',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    description: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
    isFriend: false,
  },{
    id: '5',
    name: 'John Doe 05',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    description: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
    isFriend: true,
  },
];

export default function PeoplePage() {
  const [activeTab, setActiveTab] = useState<'friends' | 'all'>('friends');
  const [search, setSearch] = useState('');

  const filteredUsers = MOCK_USERS.filter(
    user =>
      user.name.toLowerCase().includes(search.toLowerCase()) &&
      (activeTab === 'all' || (activeTab === 'friends' && user.isFriend))
  );

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">People</h1>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search people..."
        />
      </div>

      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('friends')}
            className={`pb-2 px-1 ${
              activeTab === 'friends'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500'
            }`}
          >
            Friends
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2 px-1 ${
              activeTab === 'all'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500'
            }`}
          >
            All People
          </button>
        </div>
      </div>

      <div className="grid gap-0 grid-cols-1">
        {filteredUsers.map(user => (
          <UserCard
            key={user.id}
            user={user}
            onToggleFriend={(userId) => {
              // Handle friend toggle
              console.log('Toggle friend', userId);
            }}
          />
        ))}
      </div>
    </div>
  );
}