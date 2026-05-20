import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { apiRequest } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Calendar, CheckCircle2, XCircle, Clock, Phone, Mail, MapPin, LogOut, Image as ImageIcon, Loader2,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminDashboard,
  head: () => ({ meta: [{ title: "Admin — Bookings" }, { name: "robots", content: "noindex" }] }),
});

type Booking = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  suburb: string;
  street_address: string | null;
  contact_method: string;
  service_type: string;
  item_description: string | null;
  load_size: string | null;
  access_notes: string | null;
  photo_url: string | null;
  preferred_date: string;
  preferred_time: string;
  alternative_date: string | null;
  alternative_time: string | null;
  urgency: string | null;
  status: "pending_approval" | "approved" | "rejected" | "completed" | "cancelled";
  approved_date: string | null;
  approved_time: string | null;
  admin_notes: string | null;
};

const STATUS_LABEL: Record<Booking["status"], string> = {
  pending_approval: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLOR: Record<Booking["status"], string> = {
  pending_approval: "bg-yellow text-navy",
  approved: "bg-emerald-500 text-white",
  rejected: "bg-red-500 text-white",
  completed: "bg-blue-600 text-white",
  cancelled: "bg-slate-400 text-white",
};

function AdminDashboard() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Booking["status"] | "all">("all");
  const [selected, setSelected] = useState<Booking | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => apiRequest<{ bookings: Booking[] }>("list"),
  });

  const mutation = useMutation({
    mutationFn: (vars: {
      id: string;
      status: Booking["status"];
      approved_date?: string | null;
      approved_time?: string | null;
      admin_notes?: string | null;
    }) => apiRequest("update_status", {
      method: "POST",
      body: JSON.stringify(vars)
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-bookings"] });
      setSelected(null);
    },
    onError: (err) => {
      // If token expired or invalid (401), send back to login
      if (err.message.includes("401") || err.message.toLowerCase().includes("unauthorized")) {
        localStorage.removeItem("haulmate_admin_token");
        window.location.href = "/admin/login";
      }
    }
  });

  // Handle unauthorized errors from fetching list
  useMemo(() => {
    if (error && (error.message.includes("401") || error.message.toLowerCase().includes("unauthorized"))) {
      localStorage.removeItem("haulmate_admin_token");
      window.location.href = "/admin/login";
    }
  }, [error]);

  const bookings: Booking[] = (data?.bookings as Booking[]) || [];
  const filtered = useMemo(
    () => (filter === "all" ? bookings : bookings.filter((b) => b.status === filter)),
    [bookings, filter]
  );

  const approvedByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    bookings
      .filter((b) => b.status === "approved")
      .forEach((b) => {
        const d = b.approved_date || b.preferred_date;
        if (!map.has(d)) map.set(d, []);
        map.get(d)!.push(b);
      });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [bookings]);

  const counts = useMemo(() => {
    const c = { pending_approval: 0, approved: 0, rejected: 0, completed: 0, cancelled: 0 };
    bookings.forEach((b) => (c[b.status] += 1));
    return c;
  }, [bookings]);

  const signOut = () => {
    localStorage.removeItem("haulmate_admin_token");
    window.location.href = "/admin/login";
  };


  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <Link to="/" className="text-xs text-yellow hover:underline">← Back to site</Link>
            <h1 className="font-display text-xl mt-1">Bookings Admin</h1>
          </div>
          <Button onClick={signOut} variant="ghost" className="text-white hover:bg-white/10">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {(["pending_approval", "approved", "rejected", "completed", "cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`p-3 rounded-xl border text-left transition ${
                filter === s ? "border-navy ring-2 ring-navy/20 bg-white" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="text-2xl font-display text-navy">{counts[s]}</div>
              <div className="text-xs text-muted-foreground">{STATUS_LABEL[s]}</div>
            </button>
          ))}
        </div>

        <Tabs defaultValue="list">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <TabsList>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
            <button
              onClick={() => setFilter("all")}
              className={`text-xs px-3 py-1.5 rounded-full border ${filter === "all" ? "bg-navy text-white border-navy" : "border-slate-300"}`}
            >
              Show all ({bookings.length})
            </button>
          </div>

          <TabsContent value="list" className="mt-4">
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading bookings…</div>
            )}
            {error && <p className="text-destructive text-sm">{(error as Error).message}</p>}
            <div className="grid gap-3">
              {filtered.map((b) => (
                <BookingCard key={b.id} b={b} onOpen={() => setSelected(b)} />
              ))}
              {!isLoading && filtered.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-muted-foreground">
                  No bookings in this category yet.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-4">
            <div className="grid gap-4">
              {approvedByDate.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-muted-foreground">
                  No approved bookings yet.
                </div>
              )}
              {approvedByDate.map(([date, items]) => (
                <div key={date} className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-navy font-display">
                    <Calendar className="h-4 w-4" /> {format(parseISO(date), "EEEE, d MMM yyyy")}
                  </div>
                  <div className="mt-3 space-y-2">
                    {items
                      .sort((a, b) => (a.approved_time || a.preferred_time).localeCompare(b.approved_time || b.preferred_time))
                      .map((b) => (
                        <button
                          key={b.id}
                          onClick={() => setSelected(b)}
                          className="w-full text-left flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-slate-50 hover:bg-slate-100"
                        >
                          <div>
                            <div className="font-medium text-navy">
                              {b.approved_time || b.preferred_time} — {b.full_name}
                            </div>
                            <div className="text-xs text-muted-foreground">{b.service_type} · {b.suburb}</div>
                          </div>
                          <Badge className="bg-emerald-500 text-white">Approved</Badge>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BookingDialog
        booking={selected}
        onClose={() => setSelected(null)}
        onSave={(vars) => mutation.mutate(vars)}
        saving={mutation.isPending}
      />
    </div>
  );
}

function BookingCard({ b, onOpen }: { b: Booking; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-navy/40 transition"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-navy">{b.full_name}</h3>
            <Badge className={STATUS_COLOR[b.status]}>{STATUS_LABEL[b.status]}</Badge>
          </div>
          <p className="text-sm text-slate-600 mt-1">{b.service_type} · {b.load_size || "Size TBC"}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {b.suburb}</span>
            <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {b.phone}</span>
            <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {b.email}</span>
          </div>
        </div>
        <div className="text-right text-xs">
          <div className="inline-flex items-center gap-1 text-navy font-medium"><Clock className="h-3 w-3" /> {b.preferred_date} {b.preferred_time}</div>
          {b.urgency && <div className="text-muted-foreground mt-1">{b.urgency}</div>}
        </div>
      </div>
    </button>
  );
}

function BookingDialog({
  booking,
  onClose,
  onSave,
  saving,
}: {
  booking: Booking | null;
  onClose: () => void;
  onSave: (vars: { id: string; status: Booking["status"]; approved_date?: string | null; approved_time?: string | null; admin_notes?: string | null }) => void;
  saving: boolean;
}) {
  const [approvedDate, setApprovedDate] = useState("");
  const [approvedTime, setApprovedTime] = useState("");
  const [notes, setNotes] = useState("");

  // sync defaults when booking changes
  useMemo(() => {
    if (booking) {
      setApprovedDate(booking.approved_date || booking.preferred_date);
      setApprovedTime(booking.approved_time || booking.preferred_time);
      setNotes(booking.admin_notes || "");
    }
  }, [booking?.id]);

  if (!booking) return null;
  const b = booking;

  return (
    <Dialog open={!!booking} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-navy">{b.full_name}</DialogTitle>
        </DialogHeader>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <Field label="Status"><Badge className={STATUS_COLOR[b.status]}>{STATUS_LABEL[b.status]}</Badge></Field>
          <Field label="Submitted">{format(parseISO(b.created_at), "d MMM yyyy, HH:mm")}</Field>
          <Field label="Email"><a className="text-navy hover:underline" href={`mailto:${b.email}`}>{b.email}</a></Field>
          <Field label="Phone"><a className="text-navy hover:underline" href={`tel:${b.phone}`}>{b.phone}</a></Field>
          <Field label="Preferred contact">{b.contact_method}</Field>
          <Field label="Urgency">{b.urgency || "—"}</Field>
          <Field label="Suburb">{b.suburb}</Field>
          <Field label="Address">{b.street_address || "—"}</Field>
          <Field label="Service">{b.service_type}</Field>
          <Field label="Load size">{b.load_size || "—"}</Field>
          <Field label="Preferred date">{b.preferred_date} at {b.preferred_time}</Field>
          <Field label="Alternative">{b.alternative_date ? `${b.alternative_date} ${b.alternative_time || ""}` : "—"}</Field>
          <Field label="Items" className="sm:col-span-2">{b.item_description || "—"}</Field>
          <Field label="Access notes" className="sm:col-span-2">{b.access_notes || "—"}</Field>
          {b.photo_url && (
            <Field label="Photo" className="sm:col-span-2">
              <a href={b.photo_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-navy hover:underline">
                <ImageIcon className="h-4 w-4" /> View uploaded photo
              </a>
            </Field>
          )}
        </div>

        <div className="border-t pt-4 mt-4 space-y-3">
          <h4 className="font-display text-navy">Approve or update</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="ad">Approved date</Label>
              <Input id="ad" type="date" value={approvedDate} onChange={(e) => setApprovedDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="at">Approved time</Label>
              <Input id="at" type="time" value={approvedTime} onChange={(e) => setApprovedTime(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Admin notes (sent on rejection)</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>
        </div>

        <DialogFooter className="flex flex-wrap gap-2">
          <Button
            disabled={saving}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={() => onSave({ id: b.id, status: "approved", approved_date: approvedDate, approved_time: approvedTime, admin_notes: notes || null })}
          >
            <CheckCircle2 className="h-4 w-4" /> Approve & email customer
          </Button>
          <Button
            disabled={saving}
            variant="destructive"
            onClick={() => onSave({ id: b.id, status: "rejected", admin_notes: notes || null })}
          >
            <XCircle className="h-4 w-4" /> Reject & email customer
          </Button>
          <Button
            disabled={saving}
            variant="outline"
            onClick={() => onSave({ id: b.id, status: "completed", admin_notes: notes || null })}
          >
            Mark completed
          </Button>
          <Button
            disabled={saving}
            variant="ghost"
            onClick={() => onSave({ id: b.id, status: "cancelled", admin_notes: notes || null })}
          >
            Cancel booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-navy">{children}</div>
    </div>
  );
}

// shadcn Select kept for tree-shake parity (not used here directly)
void Select;
void SelectContent;
void SelectItem;
void SelectTrigger;
void SelectValue;
