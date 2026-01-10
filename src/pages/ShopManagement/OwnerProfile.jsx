import React from "react";
import { useParams } from "react-router-dom";
import { FiPhone, FiMail, FiFileText, FiSend } from "react-icons/fi";

export default function OwnerProfile() {
  const { id } = useParams();

  // 🔹 Dummy owner data
  const owner = {
    id,
    name: "Rahul Sharma",
    phone: "9876543210",
    whatsapp: "9876543210",
    email: "rahul@gmail.com",
    aadhaar: "XXXX-XXXX-XXXX",
    image: "https://dthezntil550i.cloudfront.net/4c/latest/4c1809020315478590002784970/1280_960/58c9e944-af0e-4eca-9eb9-c45b9b2cf62f.png",
    joined: "2025-11-28",
    role: "Shop Owner",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Owner Profile: {owner.name}
        </h1>
        <span className="text-sm sm:text-base text-gray-500">
          Owner ID: #{owner.id}
        </span>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-6 flex flex-col md:flex-row gap-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <img
            src={owner.image}
            alt={owner.name}
            className="w-28 h-28 md:w-32 md:h-32 rounded-xl object-cover shadow-sm"
          />
          <div className="flex gap-2">
            <button className="flex items-center gap-1 bg-[#FE702E] hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
              <FiFileText size={16} />
              Edit Owner
            </button>
            <button className="flex items-center gap-1 border border-orange-200 hover:bg-orange-50 text-orange-500 px-4 py-2 rounded-xl text-sm font-semibold transition">
              <FiSend size={16} />
              Send Message
            </button>
          </div>
        </div>

        {/* Owner Info */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm font-medium">Full Name</p>
            <p className="text-gray-800 font-semibold">{owner.name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Email</p>
            <p className="text-gray-800 font-semibold">{owner.email}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Phone</p>
            <p className="text-gray-800 font-semibold flex items-center gap-1">
              <FiPhone /> {owner.phone}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">WhatsApp</p>
            <p className="text-gray-800 font-semibold">{owner.whatsapp}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Aadhaar</p>
            <p className="text-gray-800 font-semibold">{owner.aadhaar}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Role</p>
            <p className="text-gray-800 font-semibold">{owner.role}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Joined On</p>
            <p className="text-gray-800 font-semibold">{owner.joined}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
