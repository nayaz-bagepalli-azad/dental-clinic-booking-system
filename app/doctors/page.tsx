import { supabase } from "@/lib/supabase";

export default async function DoctorsPage() {
  const { data: doctors } = await supabase
    .from("doctors")
    .select("*");

  return (
    <main className="max-w-6xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-10">
        Our Doctors
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {doctors?.map((doc) => (
          <div
            key={doc.id}
            className="border rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-bold">
              {doc.name}
            </h2>

            <p className="text-sky-600 font-medium">
              {doc.specialty}
            </p>

            <p className="mt-3 text-gray-600 text-sm">
              {doc.bio}
            </p>

            <button className="mt-4 w-full bg-sky-600 text-white py-2 rounded-lg">
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}