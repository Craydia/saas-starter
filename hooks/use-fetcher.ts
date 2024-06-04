import { useSession } from "next-auth/react";
import { useContext, useState } from "react";
import { fetcher } from "./use-swr";
import { toast } from "@/components/ui/use-toast";


export const useFetcher = () => {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  //TODO: Add locale
  const locale = "en";
  //TODO: Set paywall
  const setPaywallVisible = (x: boolean) => null;

  const fetcherLocal = async(url: string, method: "GET" | "POST" | "PUT" | "DELETE" = "GET", body?: any, noStringify?: boolean) => {
    setLoading(true);

    const newUrl = url.includes("?") ? url + "&lang=" + locale : url + "?lang=" + locale;

    const res = await fetcher(newUrl, session, {body: noStringify ? body : JSON.stringify(body), method});
    
    if(res.status === 200){
      toast({title: "Success", duration: 3000})
    }
    else {
      toast({title: "Error", variant: "destructive", duration: 3000})
    }

    if(res.error === "tier-block") setPaywallVisible(true);
    
    setLoading(false);
    return res;
  }

  return {fetcher: fetcherLocal, loading};
}