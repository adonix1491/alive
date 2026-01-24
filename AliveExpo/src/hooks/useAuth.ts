/**
 * useAuth - 認證功能 Hook
 * 封裝 AuthContext，保持 API 相容性
 */
import { useAuthContext } from '../contexts/AuthContext';

const useAuth = () => {
    const context = useAuthContext();
    return context;
};

export default useAuth;
