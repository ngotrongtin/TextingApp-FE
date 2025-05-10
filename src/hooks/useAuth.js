import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ActiveChatContext } from '../context/ActiveChatContext';
export const useAuth = () => {
    return useContext(AuthContext);
};

export const useActiveChat = () => {
    return useContext(ActiveChatContext);
};
