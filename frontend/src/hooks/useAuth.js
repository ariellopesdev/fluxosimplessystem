import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { profile } from "../slices/userSlice";
import { logout } from "../slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();

  const { user: authUser } = useSelector((state) => state.auth);

  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      if (!authUser?.token) {
        setAuth(false);
        setLoading(false);
        return;
      }

      try {
        await dispatch(profile()).unwrap();
        setAuth(true);
      } catch (error) {
        dispatch(logout());
        setAuth(false);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [authUser, dispatch]);

  return { auth, loading };
};