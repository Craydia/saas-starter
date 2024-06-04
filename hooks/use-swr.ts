import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import useSWRLib, { SWRConfiguration } from "swr";

export const fetcher = async (url: string, session: any, params?: RequestInit) => {
  const response = await fetch(window.location.origin + "/" + url, {
    method: params?.method,
    body: params?.body,
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok && response.status !== 401 && response.status !== 404) {
    throw new Error('Failed to fetch data');
  }

  return {...(await response.json()), status: response.status};
};

export const useSWR = <T = any>(url: string, options?: SWRConfiguration, disableFetch?: boolean) => {
  const session = useSession();

  const res = useSWRLib<{data: T}>(disableFetch ? '' : url, (urlParam: any) => fetcher(urlParam, session), options);

  return {...res, data: res?.data?.data ?? ([] as T)} ?? {data: ([] as T)};
}