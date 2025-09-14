import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../store/selector';
import notificationService from '../services/notificationService';

const NotificationManager = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user) {
      // Start notification service when user is logged in
      notificationService.start(dispatch);
    } else {
      // Stop notification service when user is logged out
      notificationService.stop();
    }

    // Cleanup on unmount
    return () => {
      notificationService.stop();
    };
  }, [user, dispatch]);

  return null; // This component doesn't render anything
};

export default NotificationManager;