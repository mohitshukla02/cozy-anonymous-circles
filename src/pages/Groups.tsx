
import React, { useState, useEffect } from 'react';
import { Users, Plus, Search } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Group } from '../types/groups';
import { getGroups, saveGroups, getUserGroups, saveUserGroups, generateAnonymousName, createSampleGroups } from '../utils/groupStorage';
import GroupCard from '../components/GroupCard';
import CreateGroupModal from '../components/CreateGroupModal';

const Groups = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'recommended' | 'my-groups' | 'all' | 'recent'>('recommended');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userGroups, setUserGroups] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Initialize sample groups if none exist
    createSampleGroups();
    
    const allGroups = getGroups();
    const userGroupData = getUserGroups().filter(ug => ug.userId === user.username);
    
    setGroups(allGroups);
    setUserGroups(userGroupData.map(ug => ug.groupId));
  }, [user, navigate]);

  useEffect(() => {
    let filtered = groups;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case 'my-groups':
        filtered = filtered.filter(group => userGroups.includes(group.id));
        break;
      case 'recommended':
        if (user?.selectedTags) {
          filtered = filtered.filter(group => {
            const matchingTags = group.tags.filter(tag => user.selectedTags.includes(tag));
            return matchingTags.length >= 2;
          });
        }
        break;
      case 'recent':
        filtered = [...filtered].sort((a, b) => 
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
        break;
      case 'all':
      default:
        // Show all groups
        break;
    }

    setFilteredGroups(filtered);
  }, [groups, searchTerm, activeFilter, userGroups, user?.selectedTags]);

  const handleJoinGroup = (groupId: string) => {
    if (!user) return;

    const group = groups.find(g => g.id === groupId);
    if (!group || userGroups.includes(groupId) || group.memberIds.length >= group.memberLimit) {
      return;
    }

    // Update group membership
    const updatedGroups = groups.map(g => 
      g.id === groupId 
        ? { ...g, memberIds: [...g.memberIds, user.username] }
        : g
    );
    setGroups(updatedGroups);
    saveGroups(updatedGroups);

    // Update user groups
    const updatedUserGroups = getUserGroups();
    const anonymousName = generateAnonymousName(user.username, groupId);
    
    updatedUserGroups.push({
      userId: user.username,
      groupId,
      joinDate: new Date().toISOString(),
      role: 'member',
      anonymousName
    });
    
    saveUserGroups(updatedUserGroups);
    setUserGroups([...userGroups, groupId]);
  };

  const handleCreateGroup = (groupData: {
    name: string;
    description: string;
    tags: string[];
    memberLimit: number;
    privacy: 'open' | 'invitation';
  }) => {
    if (!user) return;

    const newGroup: Group = {
      id: Date.now().toString(),
      name: groupData.name,
      description: groupData.description,
      tags: groupData.tags,
      memberIds: [user.username],
      createdDate: new Date().toISOString(),
      memberLimit: groupData.memberLimit,
      privacy: groupData.privacy,
      adminId: user.username
    };

    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    saveGroups(updatedGroups);

    // Add creator as admin
    const updatedUserGroups = getUserGroups();
    const anonymousName = generateAnonymousName(user.username, newGroup.id);
    
    updatedUserGroups.push({
      userId: user.username,
      groupId: newGroup.id,
      joinDate: new Date().toISOString(),
      role: 'admin',
      anonymousName
    });
    
    saveUserGroups(updatedUserGroups);
    setUserGroups([...userGroups, newGroup.id]);
  };

  const filterButtons = [
    { key: 'recommended', label: 'Recommended', icon: Users },
    { key: 'my-groups', label: 'My Groups', icon: Users },
    { key: 'all', label: 'All Groups', icon: Users },
    { key: 'recent', label: 'Recently Active', icon: Users }
  ] as const;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-800 mb-4">
            Interest Groups
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover and join communities based on your hobbies, interests, and passions. 
            Connect with like-minded people in a safe, anonymous environment.
          </p>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search groups by name or description..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-amber-600 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-700 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            Create Group
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterButtons.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === key
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Groups Grid */}
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-3xl p-8 shadow-soft max-w-md mx-auto">
              <Users size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="font-heading font-semibold text-gray-800 mb-2">
                {activeFilter === 'my-groups' 
                  ? "You haven't joined any groups yet" 
                  : searchTerm 
                  ? "No groups found" 
                  : "No matching groups found"
                }
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {activeFilter === 'my-groups' 
                  ? "Join some groups to start connecting with like-minded people."
                  : searchTerm
                  ? "Try adjusting your search terms or browse all groups."
                  : "Create a new group or adjust your interests to see more recommendations."
                }
              </p>
              {activeFilter !== 'my-groups' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-amber-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-amber-700 transition-colors"
                >
                  Create Your First Group
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                userTags={user.selectedTags}
                onJoin={handleJoinGroup}
                isJoined={userGroups.includes(group.id)}
              />
            ))}
          </div>
        )}

        {/* Create Group Modal */}
        <CreateGroupModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateGroup}
          userTags={user.selectedTags}
        />
      </div>
    </div>
  );
};

export default Groups;
