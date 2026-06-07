"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Appointment = {
  id: string;
  doctor_id: string | null;

  patient_name: string | null;
  patient_email: string | null;
  patient_phone: string | null;

  appointment_date: string | null;
  appointment_time: string | null;

  status: string | null;

  created_at: string | null;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // check login
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/admin/login");
        return;
      }

      setUser(data.user);
    };

    checkUser();
  }, [router]);

  // fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setAppointments((data as Appointment[]) || []);
    };

    fetchAppointments();
  }, []);

  const updateStatus = async (
  appointmentId: string,
  status: "confirmed" | "cancelled"
) => {
  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", appointmentId);

  if (error) {
    console.error(error);
    alert("Failed to update appointment");
    return;
  }

  setAppointments((current) =>
    current.map((appointment) =>
      appointment.id === appointmentId
        ? { ...appointment, status }
        : appointment
    )
  );
};

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <main className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>


      <div className="mb-6">
        <p>
          Logged in as:
          <span className="font-semibold ml-2">
            {user?.email}
          </span>
        </p>
      </div>

<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
  <div className="border rounded-lg p-4">
    <h3 className="text-sm text-gray-500">Total</h3>
    <p className="text-3xl font-bold">
      {appointments.length}
    </p>
  </div>

  <div className="border rounded-lg p-4">
    <h3 className="text-sm text-gray-500">Pending</h3>
    <p className="text-3xl font-bold text-yellow-600">
      {
        appointments.filter(
          (a) => a.status === "pending"
        ).length
      }
    </p>
  </div>

  <div className="border rounded-lg p-4">
    <h3 className="text-sm text-gray-500">Confirmed</h3>
    <p className="text-3xl font-bold text-green-600">
      {
        appointments.filter(
          (a) => a.status === "confirmed"
        ).length
      }
    </p>
  </div>

  <div className="border rounded-lg p-4">
    <h3 className="text-sm text-gray-500">Cancelled</h3>
    <p className="text-3xl font-bold text-red-600">
      {
        appointments.filter(
          (a) => a.status === "cancelled"
        ).length
      }
    </p>
  </div>
</div>

      <h2 className="text-xl font-bold mb-4">
        Appointments
      </h2>

      {appointments.length === 0 ? (
        <p className="text-gray-500">
          No appointments found.
        </p>
      ) : (
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border rounded-lg p-4"
            >
              <p>
                <strong>Patient:</strong>{" "}
                {appointment.patient_name}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {appointment.appointment_date}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {appointment.appointment_time}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {appointment.patient_email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {appointment.patient_phone}
              </p>

<div className="mt-3 flex items-center gap-3">
  <span>
    <strong>Status:</strong>{" "}
    {appointment.status || "pending"}
  </span>

  <button
    onClick={() =>
      updateStatus(
        appointment.id,
        "confirmed"
      )
    }
    className="bg-green-600 text-white px-3 py-1 rounded text-sm"
  >
    Approve
  </button>

  <button
    onClick={() =>
      updateStatus(
        appointment.id,
        "cancelled"
      )
    }
    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
  >
    Cancel
  </button>
</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}