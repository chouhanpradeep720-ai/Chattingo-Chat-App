import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const StatusUserCard = () => {
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);

  const user = auth?.reqUser;

  const defaultAvatar =
    "https://ui-avatars.com/api/?name=User&background=128C7E&color=fff";

  const handleNavigate = () => {
    if (user?.id) {
      navigate(`/status/${user.id}`);
    }
  };

  return (
    <div
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") handleNavigate();
      }}
      className="flex cursor-pointer items-center gap-3 rounded-xl p-3 transition hover:bg-[#202c33]"
    >
      <div className="relative shrink-0">
        <img
          src={user?.profile || defaultAvatar}
          alt={user?.name || "Profile"}
          onError={(event) => {
            event.currentTarget.src = defaultAvatar;
          }}
          className="h-12 w-12 rounded-full border-2 border-[#00a884] object-cover"
        />

        <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#111b21] bg-[#00a884] text-xs text-white">
          +
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">
          {user?.name || "My Status"}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Tap to view status
        </p>
      </div>
    </div>
  );
};

export default StatusUserCard;
