import type { Enquiry } from "@/types/enquiry";
import { createClient } from "@/lib/supabase/server";

const statusStyles: Record<Enquiry["status"], string> = {
  unread: "bg-amber-50 text-amber-700 ring-amber-600/20",
  read: "bg-blue-50 text-blue-700 ring-blue-600/20",
  archived: "bg-gray-100 text-gray-600 ring-gray-500/20",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export default async function Page() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  const enquiries = (data ?? []) as Enquiry[];

  return (
    <section className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Patient communication</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-teal-950">Enquiries</h1>
            <p className="mt-2 text-sm text-gray-500">Review questions and messages submitted by visitors.</p>
          </div>
          <p className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-gray-200">
            {enquiries.length} {enquiries.length === 1 ? "enquiry" : "enquiries"}
          </p>
        </div>

        {error ? (
          <div role="alert" className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">We could not load enquiries right now. Please refresh and try again.</div>
        ) : enquiries.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-teal-950">No enquiries found</h2>
            <p className="mt-2 text-sm text-gray-500">New messages from the contact form will appear here.</p>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left">
                <thead className="bg-gray-50">
                  <tr>
                    {["Date", "Name", "Phone", "Subject", "Message", "Status"].map((heading) => (
                      <th key={heading} scope="col" className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="align-top transition-colors hover:bg-teal-50/40">
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-600">{formatDate(enquiry.created_at)}</td>
                      <td className="whitespace-nowrap px-6 py-5 text-sm font-semibold text-teal-950">{enquiry.name}</td>
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-600"><a className="hover:text-emerald-700" href={`tel:${enquiry.phone_number}`}>{enquiry.phone_number}</a></td>
                      <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-teal-900">{enquiry.subject}</td>
                      <td className="max-w-sm px-6 py-5 text-sm leading-6 text-gray-600">{enquiry.message}</td>
                      <td className="whitespace-nowrap px-6 py-5"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusStyles[enquiry.status]}`}>{enquiry.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}