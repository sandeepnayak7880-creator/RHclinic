# 🏥 Raghavendra Homoeopathic Clinic

A modern, mobile-responsive, and SEO-optimized web platform built for a local medical clinic. It features a patient-facing informational site, an integrated appointment booking system, and a secure admin dashboard for clinic management.

**🌍 Live Website:** [https://raghavendrahomeopathy.in](https://raghavendrahomeopathy.in)

---

## ✨ Key Features

* **Appointment Booking System:** Patients can easily request consultations online, stored securely in a Supabase PostgreSQL database.
* **Secure Admin Dashboard:** Protected routes utilizing Supabase Authentication for clinic staff to manage and track appointments.
* **Multi-Language Support:** Integrated Google Translate for seamless switching between English, Telugu, and Hindi.
* **Floating Quick Actions:** Persistent, mobile-optimized floating buttons for instant WhatsApp chat, direct phone calls, and Google Maps navigation.
* **Advanced Local SEO:** Fully optimized with dynamic `sitemap.xml`, `robots.txt`, optimized Meta Tags, and Google JSON-LD Medical Clinic Schema markup for top local search ranking.
* **Vercel Web Analytics:** Integrated real-time privacy-friendly traffic tracking.

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), React, TypeScript
* **Styling:** Tailwind CSS, Lucide React (Icons)
* **Backend & Database:** Supabase (PostgreSQL)
* **Authentication:** Supabase Auth
* **Hosting & CI/CD:** Vercel
* **Domain Management:** GoDaddy (`.in` domain with custom DNS routing)

---

## 🚀 Local Development

To run this project locally on your machine:

**1. Clone the repository**
```bash
git clone https://github.com/your-username/rhclinic.git
cd rhclinic
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up Environment Variables**
Create a `.env.local` file in the root directory and add your Supabase project keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**4. Start the development server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📦 Deployment

This project is configured for seamless deployment on **Vercel**.

1. Push your code to a GitHub repository.
2. Import the repository into Vercel.
3. Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel's Environment Variables settings.
4. Deploy.

---

## 👨‍💻 Developed By

Built and deployed by **Sandeep**.
