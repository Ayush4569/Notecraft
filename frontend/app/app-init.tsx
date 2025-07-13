import { useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { clearUser, setLoading, setUser } from "@/redux/slices/user";
import axios from "axios";
import { UserState } from "@/types/user";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { queryClient } from "@/helpers/tanstack";
export default function AppInit({ hasAccessToken }: { hasAccessToken: boolean }) {
  const dispatch = useAppDispatch();
  const params = useSearchParams()
  const isSubscribed = params.get("subscribed") === "true";
  const query = useQuery<UserState, Error>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`,
        {
          withCredentials: true,
        }
      );
      return res.data.user as UserState;
    },
    retry: false,
    enabled: hasAccessToken,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.isLoading) {
      dispatch(setLoading());
    }
  }, [query.isLoading]);
  useEffect(() => {
    if (query.isError) {
      dispatch(clearUser());
      console.error("Error fetching user:", query.error);
    }
  }, [query.isError]);
  useEffect(() => {

    if (query.data) {
      dispatch(
        setUser({
          id: query.data.id,
          isPro: query.data.isPro,
          name: query.data.username,
          email: query.data.email,
          profileImage: (query.data.profileImage as string) ?? "",
          status: "authenticated",
        })
      )
    }
  }, [query.isSuccess, query.data]);
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (!query.data?.isPro && isSubscribed) {
      interval = setInterval(() => {
        queryClient.refetchQueries({ queryKey: ["user"] });
      }, 4000)
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [query.data?.isPro, isSubscribed])


  return null;
}
