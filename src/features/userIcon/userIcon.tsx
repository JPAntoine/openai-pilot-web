import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserPhoto } from './userPhotoSlice';
import { getToken } from '@/app/msalinstance';
import { AppDispatch, RootState } from '@/app/store';

const UserIcon: React.FC<{ className?: string }> = ({ className }) => {
  const dispatch: AppDispatch = useDispatch();
  const userPhoto = useSelector((state: RootState) => state.userPhoto.userPhoto);
  const attemptedRetrieval = useSelector((state: RootState) => state.userPhoto.attemptedRetrieval);

  useEffect(() => {
    const getPhotoOnMount = async () => {
      if (attemptedRetrieval) return;
      const token = await getToken();
      if (token) dispatch(fetchUserPhoto(token));
    };

    getPhotoOnMount();
  }, [dispatch, attemptedRetrieval]);

  const baseStyle = "flex items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white";
  const combinedStyle = `${baseStyle} ${className}`;

  return (
    <div className={combinedStyle}>
      {userPhoto ? <img src={userPhoto} alt="User" className="rounded-full" /> : "Me"}
    </div>
  );
};

export default UserIcon;
