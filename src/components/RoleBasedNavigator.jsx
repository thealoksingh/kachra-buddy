import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/selector';

const RoleBasedNavigator = ({ navigation, route }) => {
  const user = useSelector(selectUser);
  const currentStack = route?.name;
  const previousRole = useRef(user?.role);

  useEffect(() => {
    if (user && user?.status === 'ACTIVE' && user?.role) {
      // Only navigate if role has changed and we're not already on the correct stack
      const targetStack = user.role.toLowerCase();
      const hasRoleChanged = previousRole.current && previousRole.current !== user.role;
      const isOnWrongStack = currentStack !== targetStack;
      
      if (hasRoleChanged && isOnWrongStack) {
        navigation.replace(targetStack);
      }
      
      previousRole.current = user.role;
    }
  }, [user?.role, user?.status, navigation, currentStack]);

  return null;
};

export default RoleBasedNavigator;