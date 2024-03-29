import Checkout from "@/components/utility/Checkout";
import { auth } from "@clerk/nextjs";
import { getUserCartItems } from "@/libs/actions/cart.actions";
import { getUserById } from "@/libs/actions/user.action";

const page = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const userCart = await getUserCartItems(userId);
  const user = await getUserById(userId);

  const paystackPublicKey = process.env.PAYSTACK_PUBLIC_KEY;

  return (
    <section className="relative px-20 pt-6 pb-12 m:px-6 xl:px-12">
      <h1 className="text-center text-3xl font-medium py-6 mb-6">Checkout</h1>
      <Checkout
        paystackPublicKey={paystackPublicKey!}
        userCart={userCart}
        user={user && user}
      />
    </section>
  );
};

export default page;
