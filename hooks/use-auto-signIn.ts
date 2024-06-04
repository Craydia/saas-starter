import User, { UserTypeEnum } from '@/types/user';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const useAutoSignIn = () => {
  const session = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const isInHomepage = pathname?.includes("business/home") || pathname?.includes("developer")

  const url = params?.get("url");

  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const user = session.data?.user as unknown as User;
    switch (session.status) {
      case "loading":
        setLoading(true);
        break;
      case "authenticated":
        if(isInHomepage) return;

        const tier = params?.get("tier");

        if(user.type === UserTypeEnum.DEV) router.push(url ?? "/developer");
        else router.push(url ?? ("/business/home" + (tier ? ("?tier=" + tier) : "")))
        break;
      case "unauthenticated":
        if(isInHomepage) router.push("/login")
        setLoading(false);
        break;
    }
  }, [session.status, router, session.data?.user, url, isInHomepage]);

  return loading;
}

export default useAutoSignIn