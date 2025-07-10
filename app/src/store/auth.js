import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(persist(
    set => ({
        user: null,
        token: null,
        authModalVisible: false,

        setAuth: (user, token) => set({ user, token, authModalVisible: false }),
        logout: () => set({ user: null, token: null, authModalVisible: false }),
        setAuthModal: (visible) => set({ authModalVisible: visible })
    }),
    {
        name: 'auth-storage'
    }
));

export default useAuthStore;