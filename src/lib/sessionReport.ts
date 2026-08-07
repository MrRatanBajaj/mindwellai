import jsPDF from "jspdf";
import logoUrl from "@/assets/wellmindai-logo-2.png";

/**
 * Wellbeing Snapshot report.
 *
 * Scoring bands follow the public-domain / open-licensed instruments used by
 * the open-source clinical community (see github.com/openmhealth schemas and
 * the PHQ-9 / GAD-7 / PCL-5 scoring manuals):
 *  - PHQ-9  0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 mod-severe, 20-27 severe
 *  - GAD-7  0-4 minimal, 5-9 mild, 10-14 moderate, 15-21 severe
 *  - PCL-5  cluster-count screen, >=31/80 suggests probable PTSD screen-positive
 */

export interface ClinicalSnapshot {
  phq9: { score: number; band: string; symptoms: string[] };
  gad7: { score: number; band: string; symptoms: string[] };
  pcl5: { symptoms: string[] };
  crisis: boolean;
  dsmHints: string[];
}

export interface SessionReportData {
  sessionId: string;
  startedAt: number;
  endedAt: number;
  messageCount: number;
  language: string;
  transcript: { sender: "user" | "ai"; content: string; ts: number }[];
  clinical?: ClinicalSnapshot | null;
}

export function phq9Band(score: number) {
  if (score >= 20) return "Severe";
  if (score >= 15) return "Moderately severe";
  if (score >= 10) return "Moderate";
  if (score >= 5) return "Mild";
  return "Minimal";
}

export function gad7Band(score: number) {
  if (score >= 15) return "Severe";
  if (score >= 10) return "Moderate";
  if (score >= 5) return "Mild";
  return "Minimal";
}

async function loadLogo(): Promise<string | null> {
  try {
    const res = await fetch(logoUrl);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = reject;
      fr.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateSessionReportPDF(data: SessionReportData) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const logo = await loadLogo();

  const watermark = () => {
    if (!logo) return;
    // @ts-expect-error GState is available at runtime
    const gs = doc.GState ? new doc.GState({ opacity: 0.07 }) : null;
    if (gs) (doc as any).setGState(gs);
    doc.addImage(logo, "PNG", W / 2 - 150, H / 2 - 150, 300, 300, undefined, "FAST");
    // @ts-expect-error reset opacity
    if (doc.GState) (doc as any).setGState(new doc.GState({ opacity: 1 }));
  };

  const header = () => {
    doc.setFillColor(28, 46, 41);
    doc.rect(0, 0, W, 92, "F");
    if (logo) doc.addImage(logo, "PNG", 36, 20, 52, 52, undefined, "FAST");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("WellMindAI", 100, 44);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Wellbeing Snapshot — screening summary, not a diagnosis", 100, 62);
    doc.setFontSize(9);
    doc.text(`Report ID: ${data.sessionId}`, W - 36, 44, { align: "right" });
    doc.text(new Date(data.endedAt).toLocaleString("en-IN"), W - 36, 60, { align: "right" });
  };

  header();
  watermark();

  let y = 128;
  doc.setTextColor(25, 25, 25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Session overview", 36, y);
  y += 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  const mins = Math.max(1, Math.round((data.endedAt - data.startedAt) / 60000));
  [
    `Duration: ~${mins} min`,
    `Messages exchanged: ${data.messageCount}`,
    `Language: ${data.language}`,
    `Instruments referenced: PHQ-9, GAD-7, PCL-5, DSM-5-TR / ICD-11 descriptors`,
  ].forEach((line) => {
    doc.text(line, 36, y);
    y += 16;
  });

  y += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Screening signals", 36, y);
  y += 8;

  const c = data.clinical;
  const rows: [string, string, string][] = [
    ["PHQ-9 (depression)", c ? `${c.phq9.score}/27` : "—", c ? c.phq9.band || phq9Band(c.phq9.score) : "not enough signal"],
    ["GAD-7 (anxiety)", c ? `${c.gad7.score}/21` : "—", c ? c.gad7.band || gad7Band(c.gad7.score) : "not enough signal"],
    ["PCL-5 (trauma screen)", c ? `${c.pcl5.symptoms.length} clusters` : "—", c && c.pcl5.symptoms.length >= 3 ? "Screen-positive signals" : "Below screen threshold"],
    ["Crisis flag (C-SSRS style)", c?.crisis ? "RAISED" : "None", c?.crisis ? "Immediate support recommended" : "No active risk language detected"],
  ];

  y += 14;
  doc.setFontSize(10);
  rows.forEach(([label, val, band], i) => {
    doc.setFillColor(i % 2 ? 245 : 252, i % 2 ? 249 : 253, i % 2 ? 246 : 251);
    doc.rect(36, y - 11, W - 72, 22, "F");
    doc.setFont("helvetica", "bold");
    doc.text(label, 44, y + 3);
    doc.setFont("helvetica", "normal");
    doc.text(val, 300, y + 3);
    doc.text(band, 380, y + 3);
    y += 24;
  });

  if (c?.dsmHints?.length) {
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Descriptive hypotheses (DSM-5-TR / ICD-11 language)", 36, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.splitTextToSize(c.dsmHints.join(" · "), W - 72).forEach((l: string) => {
      doc.text(l, 36, y);
      y += 14;
    });
  }

  y += 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Suggested next steps", 36, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const steps = c?.crisis
    ? [
        "Reach a human now — Tele-MANAS 14416 (India, 24x7) or iCall 9152987821.",
        "Stay with someone you trust tonight.",
        "Book a live session with a WellMindAI counsellor.",
      ]
    : [
        "Keep a 7-day mood + sleep log inside the WellMindAI journal.",
        "Continue daily 10-minute check-ins with Yaro to track change over time.",
        "If scores stay in the moderate band for 2 weeks, speak with a licensed clinician.",
      ];
  steps.forEach((s) => {
    doc.splitTextToSize("•  " + s, W - 72).forEach((l: string) => {
      doc.text(l, 36, y);
      y += 14;
    });
  });

  // Transcript page
  if (data.transcript.length) {
    doc.addPage();
    header();
    watermark();
    let ty = 128;
    doc.setTextColor(25, 25, 25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Conversation transcript", 36, ty);
    ty += 22;
    doc.setFontSize(9.5);
    data.transcript.forEach((m) => {
      doc.setFont("helvetica", "bold");
      const who = m.sender === "user" ? "You" : "Yaro";
      doc.text(`${who} · ${new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`, 36, ty);
      ty += 13;
      doc.setFont("helvetica", "normal");
      doc.splitTextToSize(m.content, W - 72).forEach((l: string) => {
        if (ty > H - 70) {
          doc.addPage();
          header();
          watermark();
          ty = 128;
        }
        doc.text(l, 36, ty);
        ty += 12.5;
      });
      ty += 8;
    });
  }

  // Footer disclaimer on every page
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      "This is an AI-generated wellbeing screening snapshot based on PHQ-9 / GAD-7 / PCL-5 public-domain instruments. It is not a medical diagnosis.",
      36,
      H - 40,
      { maxWidth: W - 72 },
    );
    doc.text(`WellMindAI · wellmindai.in · page ${p}/${pages}`, 36, H - 24);
  }

  doc.save(`wellmindai-snapshot-${data.sessionId}.pdf`);
}
