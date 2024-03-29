import Loader from "@/components/ui/Loader";

const Loading = () => {
  return (
    <section className="w-full h-[60vh] flex items-center justify-center">
      <Loader className="loader" />
    </section>
  );
};

export default Loading;
