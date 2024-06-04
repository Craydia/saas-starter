import User, { UserTypeEnum } from '@/types/user';
import { useSession } from 'next-auth/react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const useAuthenticatedPage = (goTo: "signup" | "signupBusiness" | "login" = "signup") => {
  const session = useSession();
  const router = useRouter();
  const path = usePathname();
  const search = useSearchParams();

  const originalPath = path + "&" + search?.toString();

  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    switch (session.status) {
      case "loading":
        setLoading(true);
        break;
      case "unauthenticated":
        if(goTo === "signup") router.push("/signup?url=" + originalPath);
        else if(goTo === "signupBusiness") router.push("/business/signup?url=" + originalPath);
        else router.push("/login?url=" + originalPath);
        setLoading(false);
        break;
      case "authenticated":
        setLoading(false);
        break;
    }
  }, [session.status, router, originalPath, goTo]);

  return loading;
}

export default useAuthenticatedPage;