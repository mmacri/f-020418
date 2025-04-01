import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUsers } from '@/services/userService';
import { 
  PlusCircle, 
  MoreHorizontal, 
  User, 
  Shield, 
  Edit, 
  Trash, 
  Search,
  ShieldAlert,
  ShieldCheck, 
  ShieldQuestion,
  UserCog
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

const UserForm = ({ 
  user, 
  onSave, 
  onCancel 
}: { 
  user?: User, 
  onSave: (userData: Partial<User> & { password?: string }) => void, 
  onCancel: () => void 
}) => {
  const isEditing = !!user;
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || 'user');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData: Partial<User> & { password?: string } = {
      name,
      email,
      role: role as 'admin' | 'editor' | 'user',
      avatar: avatar || undefined
    };
    
    if (!isEditing && password) {
      userData.password = password;
    }
    
    onSave(userData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input 
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="User name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          required
        />
      </div>
      
      {!isEditing && (
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            required={!isEditing}
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select 
          value={role} 
          onValueChange={(value) => setRole(value as 'admin' | 'editor' | 'user')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrator</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="user">Regular User</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="avatar">Avatar URL</Label>
        <Input 
          id="avatar"
          value={avatar || ''}
          onChange={(e) => setAvatar(e.target.value)}
          placeholder="https://example.com/avatar.png"
        />
      </div>
      
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update User' : 'Create User'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin':
      return <ShieldAlert className="h-4 w-4 text-red-500" />;
    case 'editor':
      return <ShieldCheck className="h-4 w-4 text-blue-500" />;
    default:
      return <ShieldQuestion className="h-4 w-4 text-gray-500" />;
  }
};

const AuthUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userData = await getUsers();
        setUsers(userData);
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddUser = (userData: Partial<User> & { password?: string }) => {
    const newUser: User = {
      id: Math.max(0, ...users.map(u => u.id)) + 1,
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'user',
      avatar: userData.avatar,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setUsers([...users, newUser]);
    setNewUserDialogOpen(false);
    toast.success('User created successfully');
  };
  
  const handleUpdateUser = (userData: Partial<User>) => {
    if (!editingUser) return;
    
    const updatedUsers = users.map(user => 
      user.id === editingUser.id
        ? { ...user, ...userData, updatedAt: new Date().toISOString() }
        : user
    );
    
    setUsers(updatedUsers);
    setEditingUser(undefined);
    toast.success('User updated successfully');
  };
  
  const handleDeleteUser = (userId: number) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    toast.success('User deleted successfully');
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              View and manage user accounts
            </CardDescription>
          </div>
          <Dialog open={newUserDialogOpen} onOpenChange={setNewUserDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Add User</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system. Users can be assigned different roles with varying permissions.
                </DialogDescription>
              </DialogHeader>
              <UserForm 
                onSave={handleAddUser} 
                onCancel={() => setNewUserDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email or role"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="py-10 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-10 text-center border rounded-md bg-muted/20">
              <User className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No users found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'Add some users to get started'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map(user => (
                <div 
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/50 text-xs">
                      {getRoleIcon(user.role)}
                      <span className="capitalize">{user.role}</span>
                    </div>
                    
                    <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => {
                      if (!open) setEditingUser(undefined);
                    }}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DialogTrigger asChild>
                            <DropdownMenuItem onClick={() => setEditingUser(user)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                          <DialogDescription>
                            Update user details and permissions
                          </DialogDescription>
                        </DialogHeader>
                        {editingUser && (
                          <UserForm 
                            user={editingUser}
                            onSave={handleUpdateUser} 
                            onCancel={() => setEditingUser(undefined)} 
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Total users: {users.length}
          </p>
          <div className="text-sm text-muted-foreground">
            <span className="mr-2">{users.filter(u => u.role === 'admin').length} Admins</span>
            <span className="mr-2">{users.filter(u => u.role === 'editor').length} Editors</span>
            <span>{users.filter(u => u.role === 'user').length} Users</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthUsers;
