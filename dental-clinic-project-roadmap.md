# Dental Clinic Booking System - Project Progress & Roadmap

## Project Overview

Building a modern dental clinic website and appointment booking system using:

### Tech Stack

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Supabase
* Supabase Auth
* Vercel Deployment

---

# Phase 1: Project Setup

## Create Next.js Project

```bash
npx create-next-app@latest dental-clinic
cd dental-clinic
npm install
```

## Install Supabase

```bash
npm install @supabase/supabase-js
```

## Environment Variables

Create:

```text
.env.local
```

inside project root.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

# Phase 2: Supabase Database

## Doctors Table

```sql
create table doctors (
  id uuid primary key default gen_random_uuid(),
  name text,
  specialty text,
  photo_url text,
  bio text
);
```

Sample Data:

* Dr. Sarah Johnson
* Dr. Michael Chen
* Dr. Emily Brown

---

## Appointments Table

```sql
create table appointments (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references doctors(id),

  patient_name text,
  patient_email text,
  patient_phone text,

  appointment_date date,
  appointment_time time,

  status text default 'pending',

  created_at timestamp default now(),

  unique(
    doctor_id,
    appointment_date,
    appointment_time
  )
);
```

Purpose:

* Prevent double booking
* Store appointments
* Track appointment status

---

## Working Hours Table

```sql
create table working_hours (
  id uuid primary key default gen_random_uuid(),

  doctor_id uuid references doctors(id),

  day_of_week integer,

  start_time time,
  end_time time
);
```

Day Mapping:

```text
0 = Sunday
1 = Monday
2 = Tuesday
3 = Wednesday
4 = Thursday
5 = Friday
6 = Saturday
```

---

# Phase 3: Supabase Client

File:

```text
lib/supabase.ts
```

```ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

---

# Phase 4: Doctor Listing

File:

```text
app/page.tsx
```

Fetch doctors from Supabase.

Doctor Type:

```ts
type Doctor = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  photo_url?: string;
};
```

State:

```ts
const [doctors, setDoctors] =
  useState<Doctor[]>([]);
```

Important:

TypeScript error fixed by explicitly typing state arrays.

---

# Phase 5: Appointment Booking

File:

```text
app/appointment/page.tsx
```

Features:

* Doctor selection
* Date selection
* Time slot selection
* Booking creation

---

## Time Slot Generator

File:

```text
lib/slots.ts
```

Current:

```ts
generateTimeSlots(
  "09:00",
  "17:00",
  30
);
```

Future:

Replace with dynamic doctor schedules.

---

## Patient Form

Fields:

* Name
* Email
* Phone

State:

```ts
const [patientName, setPatientName] =
  useState("");

const [patientEmail, setPatientEmail] =
  useState("");

const [patientPhone, setPatientPhone] =
  useState("");
```

Insert:

```ts
await supabase
  .from("appointments")
  .insert({
    doctor_id: doctorId,
    appointment_date: date,
    appointment_time: selectedSlot,

    patient_name: patientName,
    patient_email: patientEmail,
    patient_phone: patientPhone,
  });
```

---

# Phase 6: Admin Authentication

## Supabase Auth

Enable:

Authentication → Providers → Email

Create admin:

```text
admin@clinic.com
```

Password:

```text
your-password
```

---

## Login Page

File:

```text
app/admin/login/page.tsx
```

Uses:

```ts
supabase.auth.signInWithPassword()
```

After login:

```ts
router.push("/admin");
```

---

# Phase 7: Admin Dashboard

File:

```text
app/admin/page.tsx
```

---

## Appointment Type

```ts
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
```

---

## Dashboard Features

### View Appointments

Shows:

* Patient
* Date
* Time
* Email
* Phone
* Status

---

### Dashboard Metrics

Cards:

```text
Total
Pending
Confirmed
Cancelled
```

Example:

```tsx
appointments.length

appointments.filter(
  a => a.status === "pending"
).length
```

---

## Approve Appointment

```ts
const updateStatus = async (
  appointmentId: string,
  status: "confirmed" | "cancelled"
) => {
  await supabase
    .from("appointments")
    .update({ status })
    .eq("id", appointmentId);
};
```

Approve Button:

```tsx
updateStatus(
  appointment.id,
  "confirmed"
);
```

---

## Cancel Appointment

```tsx
updateStatus(
  appointment.id,
  "cancelled"
);
```

---

## Logout

```ts
await supabase.auth.signOut();
```

Redirect:

```ts
router.push("/admin/login");
```

---

# Current Project Status

Completed:

* Next.js Setup
* Tailwind
* Supabase Integration
* Doctors Table
* Appointment Table
* Working Hours Table
* Doctor Listing
* Appointment Booking
* Double Booking Protection
* Supabase Authentication
* Admin Login
* Admin Dashboard
* Dashboard Metrics
* Appointment Approval
* Appointment Cancellation

---

# Remaining Work

## Phase 8: Doctor Management

Create:

```text
app/admin/doctors/page.tsx
```

Features:

* View Doctors
* Add Doctor
* Edit Doctor
* Delete Doctor

Fields:

```text
Name
Specialty
Bio
Photo URL
```

---

## Phase 9: Working Hours Management

Admin should manage:

```text
Doctor
Day
Start Time
End Time
```

Store in:

```sql
working_hours
```

---

## Phase 10: Dynamic Slot Generation

Replace:

```ts
generateTimeSlots(
  "09:00",
  "17:00",
  30
);
```

With:

```ts
working_hours
```

per doctor.

Example:

```text
Dr. Sarah
09:00-17:00

Dr. Michael
10:00-18:00
```

---

## Phase 11: Email Confirmation

After booking:

Send email to:

```text
patient_email
```

Possible options:

* Resend
* EmailJS
* Supabase Edge Functions

---

## Phase 12: UI Improvements

Pages:

* Home
* About
* Services
* Doctors
* Contact
* Appointment

Improve:

* Navbar
* Footer
* Mobile Responsiveness
* Loading States
* Empty States
* Better Design

---

## Phase 13: Deployment

Push:

```bash
git add .
git commit -m "Dental Clinic App"
git push
```

Deploy:

* Vercel

Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

# Production Roadmap

Future Features:

* SMS Reminders
* WhatsApp Notifications
* Patient Accounts
* Online Payments
* Google Calendar Integration
* Multi-Clinic Support
* Analytics Dashboard

---

# Current Priority

1. Doctor CRUD
2. Working Hours Management
3. Dynamic Slot Generation
4. Email Confirmation
5. Deployment
6. UI Polish

The project is currently at a functional MVP stage with booking, administration, and appointment management working.
