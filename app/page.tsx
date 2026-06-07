import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-sky-600 text-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold">
            Clinic Name Placeholder
          </h1>

          <p className="mt-4 text-lg">
            Modern dental care for your entire family
          </p>

          <Link
            href="/appointment"
            className="inline-block mt-6 bg-white text-sky-600 px-6 py-3 rounded-lg font-medium"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Quick links */}
      <section className="max-w-6xl mx-auto p-10 grid md:grid-cols-3 gap-6">
        <Link href="/doctors" className="border p-6 rounded-xl">
          <h2 className="font-bold text-xl">Our Doctors</h2>
          <p className="text-gray-600">
            Meet our experienced dental specialists
          </p>
        </Link>

        <Link href="/services" className="border p-6 rounded-xl">
          <h2 className="font-bold text-xl">Services</h2>
          <p className="text-gray-600">
            Complete dental care solutions
          </p>
        </Link>

        <Link href="/contact" className="border p-6 rounded-xl">
          <h2 className="font-bold text-xl">Contact</h2>
          <p className="text-gray-600">
            Get in touch with us
          </p>
        </Link>
      </section>
    </main>
  );
}