// Client-side PHP API helpers

export const PHP_API_URL = "/php/api.php";

export function isSandbox(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return (
    host.includes("lovable.app") ||
    host.includes("webcontainer.io") ||
    host.includes("github.dev")
  );
}

export function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("haulmate_admin_token") : null;
  return token
    ? {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };
}

export async function uploadPhoto(file: File): Promise<string> {
  if (isSandbox()) {
    console.warn("PHP Sandbox Fallback: Simulating successful photo upload.");
    // Return a beautiful sample trash image for testing purposes on sandbox
    return "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800";
  }

  const formData = new FormData();
  formData.append("photo", file);

  const res = await fetch(`${PHP_API_URL}?action=upload`, {
    method: "POST",
    body: formData,
  });

  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch (err) {
    if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
      throw new Error("Failed to connect to PHP upload endpoint. The server returned a 404 or HTML response. Ensure the PHP backend is active.");
    }
    throw new Error(text.substring(0, 200) || "Failed to upload photo");
  }

  if (!res.ok || data.success === false) {
    throw new Error(data.error || "Failed to upload photo");
  }

  return data.publicUrl;
}

export async function apiRequest<T = any>(
  action: string,
  options: RequestInit = {}
): Promise<T> {
  // If we are in the Lovable Sandbox preview, mock backend responses so the UI works
  if (isSandbox()) {
    console.warn(`PHP Sandbox Fallback: Mocking response for action: ${action}`);
    if (action === "submit") {
      return { success: true, booking: { id: "sandbox-mock-id" } } as any;
    }
    if (action === "login") {
      const body = options.body ? JSON.parse(options.body as string) : {};
      if (body.email === "admin@haulmate.com.au" && body.password === "admin123") {
        return { success: true, token: "sandbox-mock-token-jwt-style-signature" } as any;
      } else {
        throw new Error("Invalid admin credentials (Sandbox Mock: use admin@haulmate.com.au / admin123)");
      }
    }
    if (action === "list") {
      return {
        success: true,
        bookings: [
          {
            id: "sb-1",
            created_at: new Date(Date.now() - 3600000).toISOString(),
            full_name: "John Doe",
            email: "john@example.com",
            phone: "0412 345 678",
            suburb: "Subiaco",
            street_address: "123 Main Street",
            contact_method: "Call",
            service_type: "Rubbish removal",
            item_description: "Broken couch, old refrigerator, and some cardboard boxes.",
            load_size: "1 Ute load",
            access_notes: "Driveway parking, easy access.",
            photo_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800",
            preferred_date: "2026-05-25",
            preferred_time: "10:00 AM",
            alternative_date: "2026-05-26",
            alternative_time: "02:00 PM",
            urgency: "Urgent",
            status: "pending_approval",
            approved_date: null,
            approved_time: null,
            admin_notes: null,
          },
          {
            id: "sb-2",
            created_at: new Date(Date.now() - 7200000 * 2).toISOString(),
            full_name: "Sarah Miller",
            email: "sarah@example.com",
            phone: "0498 765 432",
            suburb: "Fremantle",
            street_address: "45 Marine Terrace",
            contact_method: "WhatsApp",
            service_type: "Garden waste",
            item_description: "Prunings, tree limbs, grass clippings.",
            load_size: "2 Ute loads",
            access_notes: "Rear lane access through wooden gate.",
            photo_url: null,
            preferred_date: "2026-05-27",
            preferred_time: "09:00 AM",
            alternative_date: null,
            alternative_time: null,
            urgency: "Flexible",
            status: "approved",
            approved_date: "2026-05-27",
            approved_time: "09:30 AM",
            admin_notes: "Assigned team A",
          }
        ]
      } as any;
    }
    if (action === "update_status") {
      return { success: true } as any;
    }
  }

  const url = `${PHP_API_URL}?action=${action}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch (err) {
    if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
      throw new Error(`Failed to connect to the PHP backend. The server returned a 404 Page Not Found or HTML page. Please verify your files are uploaded to the /php/ directory on your server.`);
    }
    throw new Error(text.substring(0, 200) || `HTTP error ${response.status}`);
  }

  if (!response.ok || json.success === false) {
    throw new Error(json.error || `Request failed with status ${response.status}`);
  }

  return json as T;
}
