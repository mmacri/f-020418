
import React from "react";
import { UserProfile } from "@/types/social";
import { FileUpload } from "@/components/FileUpload";
import { ProfileSettings } from "@/components/social/ProfileSettings";

interface ProfileEditFormProps {
  profile: UserProfile;
  avatarFile: File | null;
  isUploading: boolean;
  onAvatarChange: (file: File | null) => void;
  onUpdateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  onDeleteAccount: () => Promise<boolean>;
  onCancel: () => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  profile,
  avatarFile,
  isUploading,
  onAvatarChange,
  onUpdateProfile,
  onDeleteAccount,
  onCancel
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        {profile.avatar_url && (
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img 
                src={profile.avatar_url} 
                alt={profile.display_name} 
                className="h-24 w-24 rounded-full object-cover"
              />
            </div>
          </div>
        )}
        
        <div className="max-w-md mx-auto mb-6">
          <FileUpload
            onFileChange={onAvatarChange}
            accept="image/*"
            maxSizeMB={2}
            className="mb-4"
          />
        </div>
      </div>
      
      <ProfileSettings 
        profile={profile}
        onSave={onUpdateProfile}
        onDeleteAccount={onDeleteAccount}
        onCancel={onCancel}
        isUploading={isUploading}
      />
    </div>
  );
};
