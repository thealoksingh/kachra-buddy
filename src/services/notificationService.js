import { fetchNotifications } from '../store/thunks/notificationThunk';

class NotificationService {
  constructor() {
    this.intervalId = null;
    this.dispatch = null;
  }

  start(dispatch) {
    this.dispatch = dispatch;
    // Fetch notifications immediately
    this.dispatch(fetchNotifications());
    
    // Set up interval to fetch every 300 seconds
    this.intervalId = setInterval(() => {
      this.dispatch(fetchNotifications());
    }, 300000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.dispatch = null;
  }
}

export default new NotificationService();