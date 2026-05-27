import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RETENTION_YEARS = 5;

type Row = Record<string, unknown>;

function toCSV(rows: Row[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const r of rows) lines.push(headers.map((h) => escape(r[h])).join(","));
  return lines.join("\n");
}

async function fetchAllOlderThan(
  supabase: ReturnType<typeof createClient>,
  table: string,
  timestampCol: string,
  cutoffIso: string,
): Promise<Row[]> {
  const all: Row[] = [];
  const pageSize = 1000;
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .lt(timestampCol, cutoffIso)
      .order(timestampCol, { ascending: true })
      .range(from, from + pageSize - 1);
    if (error) throw new Error(`Failed reading ${table}: ${error.message}`);
    if (!data || data.length === 0) break;
    all.push(...(data as Row[]));
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return all;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - RETENTION_YEARS);
    const cutoffIso = cutoff.toISOString();
    const stamp = new Date().toISOString().slice(0, 10);

    const targets = [
      { table: "energy_logs", ts: "timestamp" },
      { table: "site_visits", ts: "visited_at" },
      { table: "device_audit_log", ts: "changed_at" },
    ] as const;

    const attachments: { filename: string; content: string }[] = [];
    const summary: { table: string; count: number }[] = [];

    for (const t of targets) {
      const rows = await fetchAllOlderThan(supabase, t.table, t.ts, cutoffIso);
      summary.push({ table: t.table, count: rows.length });
      if (rows.length > 0) {
        const csv = toCSV(rows);
        attachments.push({
          filename: `${t.table}_archive_${stamp}.csv`,
          content: btoa(unescape(encodeURIComponent(csv))),
        });
      }
    }

    const totalRows = summary.reduce((s, x) => s + x.count, 0);

    // Find super admin emails
    const { data: superAdmins, error: roleErr } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "super_admin");
    if (roleErr) throw new Error(`Role lookup failed: ${roleErr.message}`);

    const adminIds = (superAdmins ?? []).map((r: any) => r.user_id);
    let adminEmails: string[] = [];
    if (adminIds.length > 0) {
      const { data: profiles, error: profErr } = await supabase
        .from("profiles")
        .select("email")
        .in("user_id", adminIds);
      if (profErr) throw new Error(`Profile lookup failed: ${profErr.message}`);
      adminEmails = (profiles ?? []).map((p: any) => p.email).filter(Boolean);
    }
    if (adminEmails.length === 0) adminEmails = ["campuswattwatch@gmail.com"];

    const resend = new Resend(RESEND_API_KEY);

    const summaryHtml = summary
      .map((s) => `<li><strong>${s.table}</strong>: ${s.count.toLocaleString()} record(s)</li>`)
      .join("");

    if (totalRows === 0) {
      // Nothing to archive — send a short heads-up only, no deletes needed.
      await resend.emails.send({
        from: "WattLog Retention <onboarding@resend.dev>",
        to: adminEmails,
        subject: `WattLog 5-Year Retention — Nothing to purge (${stamp})`,
        html: `<p>The monthly retention sweep found no records older than ${RETENTION_YEARS} years.</p>
               <ul>${summaryHtml}</ul>`,
      });
      return new Response(JSON.stringify({ ok: true, purged: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send archive email FIRST. Only proceed to delete if email succeeded.
    const { error: emailErr } = await resend.emails.send({
      from: "WattLog Retention <onboarding@resend.dev>",
      to: adminEmails,
      subject: `WattLog 5-Year Retention Archive — ${stamp}`,
      html: `
        <h2 style="color:#16a34a">WattLog Data Retention Archive</h2>
        <p>The following records older than ${RETENTION_YEARS} years (cutoff <strong>${cutoffIso}</strong>) have been exported and are attached as CSV files. After this email is sent, the records will be permanently deleted from the database.</p>
        <ul>${summaryHtml}</ul>
        <p style="color:#71717a;font-size:12px">Generated automatically on ${stamp}.</p>
      `,
      attachments,
    });
    if (emailErr) {
      console.error("Archive email failed:", JSON.stringify(emailErr));
      throw new Error("Archive email failed — purge aborted to prevent data loss");
    }

    // Email delivered → safe to hard-delete.
    const { error: purgeErr } = await supabase.rpc("purge_old_records");
    if (purgeErr) throw new Error(`Purge failed: ${purgeErr.message}`);

    return new Response(
      JSON.stringify({ ok: true, purged: totalRows, summary, recipients: adminEmails }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    console.error("purge-and-archive error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
