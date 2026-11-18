import { AiOutlineClose } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import StatusUserCard from "./StatusUserCard";

const Status = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(-1);
  };

  return (
    <div className="flex h-screen h-[100dvh] w-full overflow-hidden bg-[#111b21]">
      {/* Left Sidebar */}
      <div className="flex h-full w-full flex-col border-r border-gray-700 bg-[#111b21] sm:w-[380px] sm:shrink-0 lg:w-[420px]">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#202c33] px-5 py-5">
          <h1 className="text-lg font-semibold text-white">
            Status
          </h1>

          <button
            type="button"
            onClick={handleNavigate}
            title="Close status"
            className="rounded-full p-2 text-gray-300 transition hover:bg-gray-700"
          >
            <AiOutlineClose className="text-xl" />
          </button>
        </div>

        {/* My Status */}
        <div className="border-b border-gray-700 px-4 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            My status
          </p>

          <StatusUserCard />
        </div>

        {/* Recent Updates */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Recent updates
          </p>

          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <StatusUserCard key={item} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 px-4 py-3">
          <p className="text-center text-xs text-gray-500">
            Status updates disappear after 24 hours
          </p>
        </div>
      </div>

      {/* Right Preview Area - Desktop */}
      <div className="hidden flex-1 flex-col items-center justify-center bg-[#0b141a] sm:flex">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#202c33]">
            <BsThreeDotsVertical className="text-4xl text-gray-400" />
          </div>

          <h2 className="text-2xl font-light text-gray-200">
            Chattingo Status
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
            Select a contact's status update to view it here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Status;
