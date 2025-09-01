import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCharacterDetails } from "../apis/api.helper"; // adjust path if needed

// Define Character type (adjust fields according to your API)
interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  origin?: {
    name: string;
  };
  location?: {
    name: string;
  };
}

function CharacterDetails() {
  const { id } = useParams({ from: "/character/$id" });
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
  } = useQuery<Character>({
    queryKey: ["character", id],
    queryFn: () => fetchCharacterDetails(Number(id)),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-2xl max-w-md w-full h-80 flex items-center justify-center text-lg text-gray-600">
          Loading character...
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-2xl max-w-md w-full h-80 flex items-center justify-center text-red-500">
          Error loading character details
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden max-w-md w-full">
        {/* Character Image */}
        <div className="w-full aspect-square bg-gray-100">
          <img
            src={data.image}
            alt={data.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Character Info */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{data.name}</h1>
          <p className="text-gray-600 mb-4">
            <span className="font-semibold">{data.species}</span>: {data.status}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Gender:</span> {data.gender}
            </p>
            <p>
              <span className="font-semibold">Type:</span> {data.type || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Origin:</span> {data.origin?.name}
            </p>
            <p>
              <span className="font-semibold">Location:</span>{" "}
              {data.location?.name}
            </p>
          </div>

          {/* Back Button */}
          <div className="mt-6">
            <button
              onClick={() => navigate({ to: "/" })}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
            >
              ← Back to Characters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CharacterDetails;
