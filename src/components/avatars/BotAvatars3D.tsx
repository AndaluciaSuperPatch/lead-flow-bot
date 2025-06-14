
import React from "react";
import BotAvatarChat from "./BotAvatarChat";

const avatars = [
  {
    src: "/lovable-uploads/292a5399-6fa6-455d-bb8c-06d707f26e0a.png",
    name: "🤸‍♀️ Pelirroja deportista",
  },
  {
    src: "/lovable-uploads/e2d78ace-bb4b-496b-8249-c9aeed2545bd.png",
    name: "🤵🏻 Moreno formal",
  },
];

const BotAvatars3D = () => (
  <div className="w-full rounded-2xl border-2 border-indigo-200 bg-indigo-50 py-6 my-6 shadow-lg flex flex-col items-center animate-fade-in">
    <div className="flex flex-row gap-10 justify-center items-center mb-3">
      {avatars.map((avatar) => (
        <div key={avatar.name} className="flex flex-col items-center">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-300 shadow-md bg-white hover:scale-105 transition-transform duration-300">
            <img
              src={avatar.src}
              alt={avatar.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
          <span className="mt-3 text-base font-semibold text-center">{avatar.name}</span>
        </div>
      ))}
    </div>
    <div className="flex flex-row gap-6 text-sm text-gray-600 justify-center">
      <span>¡Tus asistentes virtuales personalizados están listos!</span>
    </div>
    <BotAvatarChat />
  </div>
);

export default BotAvatars3D;
