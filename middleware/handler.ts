import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export const middlewareChain = (
  ...middlewares: Array<(req: any, res: NextApiResponse, next: () => void) => any>
) => {
  return async (request: NextRequest | Request, response: NextApiResponse) => {
    try{
    let res: any;
    for (let i = 0; i < middlewares.length; i++) {
      let nextInvoked = false;
      const next = () => {
        nextInvoked = true;
      };
      res = await middlewares[i](request, response, next);
      if (!nextInvoked) {
        break;
      }
    }
    return res;
    }
    catch{
      // Return an error response
    return NextResponse.json({
      status: 'error',
      message: 'Failed to create user',
    }, {
      status: 500
    });
    }
  };
};