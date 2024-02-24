import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const secret = process.env.PAYSTACK_SECRET_KEY as string;

export function POST(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request method is POST
  if (req.method === "POST") {
    // Validate the event
    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash === req.headers["x-paystack-signature"]) {
      // Retrieve the request body
      const event = req.body;
      // Do something with the event
      if (event && event.event === "transfer.success") {
        console.log("Transfer successful");
        return res.status(200).json({ message: "Transfer successful" });
      }
    }

    // Send a 200 response
    res.send(200);
  } else {
    // Send a 405 response for other methods
    res.status(405).send("Method Not Allowed");
  }
}

// Paystack Webhook function ends here

// import { NextRequest, NextResponse } from "next/server";

// export function POST(req: NextRequest, res: NextResponse) {
//   // Retrieve the request's body
//   const event = req.body;

//   // Do something with event
//   return new Response("", { status: 200 });
// }
