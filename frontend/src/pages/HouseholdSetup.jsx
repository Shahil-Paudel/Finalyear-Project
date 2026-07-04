import { useEffect, useState } from "react";
import { getHousehold } from "../services/api";

export default function HouseholdSetup() {
  const [household, setHousehold] = useState(null);
  const [loading, setLoading] =useState(true);

  useEffect(() => {
    async function loadHousehold() {
      try {
        const data = await getHousehold();
        setHousehold(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadHousehold();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-xl">
        Loading household...
      </div>
    );
  }

  if (!household) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <div className="rounded-xl bg-red-100 p-6 text-red-700">
          Household not found.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">

      <h1 className="mb-8 text-4xl font-bold">
        My Household
      </h1>

      {/* Household Information */}

      <div className="mb-8 rounded-xl bg-white p-6 shadow">

        <h2 className="mb-4 text-2xl font-semibold">
          Household Information
        </h2>

        <div className="space-y-3">

          <p>
            <span className="font-semibold">
              Name:
            </span>{" "}
            {household.name}
          </p>

          <p>
            <span className="font-semibold">
              Address:
            </span>{" "}
            {household.address}
          </p>

          <p>
            <span className="font-semibold">
              Created:
            </span>{" "}
            {new Date(household.created_at).toLocaleDateString()}
          </p>

        </div>

      </div>

      {/* Members */}

      <div className="rounded-xl bg-white p-6 shadow">

        <h2 className="mb-6 text-2xl font-semibold">
          Household Members
        </h2>

        {household.members.length === 0 ? (
          <p>No household members.</p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>

                <tr className="border-b bg-gray-100">

                  <th className="p-3 text-left">
                    Username
                  </th>

                  <th className="p-3 text-left">
                    Role
                  </th>

                  <th className="p-3 text-left">
                    Joined
                  </th>

                </tr>

              </thead>

              <tbody>

                {household.members.map((member) => (

                  <tr
                    key={member.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-3">
                      {member.username}
                    </td>

                    <td className="p-3 capitalize">
                      {member.role}
                    </td>

                    <td className="p-3">
                      {new Date(member.joined_at).toLocaleDateString()}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}