"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { generateTimeSlots } from "@/lib/slots";

/* ✅ Doctor type added */
type Doctor = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  photo_url?: string;
};

export default function AppointmentPage() {
  /* ✅ FIXED: typed state */
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  // load doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      const { data } = await supabase
        .from("doctors")
        .select("*");

      setDoctors((data as Doctor[]) || []);
    };

    fetchDoctors();
  }, []);

  // fetch booked slots
  const fetchBookedSlots = async (
    selectedDate: string,
    docId: string
  ) => {
    const { data } = await supabase
      .from("appointments")
      .select("appointment_time")
      .eq("appointment_date", selectedDate)
      .eq("doctor_id", docId);

    setBookedSlots(
      data?.map((a: any) => a.appointment_time) || []
    );
  };

  // generate slots when doctor/date changes
  useEffect(() => {
    if (!doctorId || !date) return;

    const timeSlots = generateTimeSlots(
      "09:00",
      "17:00",
      30
    );

    setSlots(timeSlots);
    fetchBookedSlots(date, doctorId);
  }, [doctorId, date]);

  // book appointment
  const bookAppointment = async () => {
    const { error } = await supabase
      .from("appointments")
      .insert({
        doctor_id: doctorId,
        appointment_date: date,
        appointment_time: selectedSlot,
        patient_name: "Walk-in Patient",
        patient_email: "test@test.com",
        patient_phone: "0000000000",
      });

    if (error) {
      alert("Slot already booked!");
      return;
    }

    alert("Appointment booked successfully!");
  };

  return (
    <main className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">
        Book Appointment
      </h1>

      {/* Doctor select */}
      <select
        className="border p-2 w-full mb-4"
        onChange={(e) => setDoctorId(e.target.value)}
      >
        <option value="">Select Doctor</option>

        {doctors.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.name}
          </option>
        ))}
      </select>

      {/* Date */}
      <input
        type="date"
        className="border p-2 w-full mb-4"
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Slots */}
      <div className="grid grid-cols-4 gap-2">
        {slots.map((slot) => {
          const isBooked =
            bookedSlots.includes(slot);

          return (
            <button
              key={slot}
              disabled={isBooked}
              onClick={() =>
                setSelectedSlot(slot)
              }
              className={`p-2 border rounded ${
                isBooked
                  ? "bg-gray-300 cursor-not-allowed"
                  : selectedSlot === slot
                  ? "bg-sky-600 text-white"
                  : ""
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>

      {/* Book button */}
      <button
        onClick={bookAppointment}
        disabled={!selectedSlot}
        className="mt-6 bg-sky-600 text-white px-6 py-2 rounded"
      >
        Confirm Appointment
      </button>
    </main>
  );
}