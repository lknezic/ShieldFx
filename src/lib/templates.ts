import { Account, Violation } from "@/types/account";

type EmailMode = "WARNING" | "SUSPENSION";

interface GeneratedEmail {
  subject: string;
  body: string;
}

/**
 * Context-aware email template engine.
 * Reads: current violations, warning history, audit trail, connected accounts.
 * Tone: always professional/neutral. Facts do the escalating.
 */
export function generateEmail(
  account: Account,
  selectedViolation: Violation,
  mode: EmailMode
): GeneratedEmail {
  if (mode === "SUSPENSION") {
    return generateSuspensionEmail(account, selectedViolation);
  }
  return generateWarningEmail(account, selectedViolation);
}

// ── Warning Email ──

function generateWarningEmail(account: Account, violation: Violation): GeneratedEmail {
  const warningNum = account.warningCount + 1;
  const isFirst = account.warningCount === 0;
  const priorHistory = buildPriorWarningSection(account);
  const connectedHistory = buildConnectedAccountSection(account);
  const evidenceBlock = buildEvidenceBlock(violation, account);
  const violationRulesRef = buildRulesReference(violation);

  const subjectSuffix = isFirst ? "" : " \u2013 Previous Warnings on Record";
  const subject = `[Warning${isFirst ? "" : ` #${warningNum}`}] ${violation.rule} Violation Detected \u2013 Account ${account.externalId}${subjectSuffix}`;

  const parts: string[] = [];

  parts.push(`Dear ${account.name},`);
  parts.push("");
  parts.push(`Our automated risk management system has detected ${violation.rule.toLowerCase()} activity on your account (${account.externalId}).`);

  if (priorHistory) {
    parts.push("");
    parts.push(priorHistory);
  }

  if (connectedHistory) {
    parts.push("");
    parts.push(connectedHistory);
  }

  if (!isFirst) {
    parts.push("");
    parts.push(`Despite ${account.warningCount} prior warning${account.warningCount > 1 ? "s" : ""}, our systems have continued to detect the following:`);
  }

  parts.push("");
  parts.push(evidenceBlock);

  parts.push("");
  parts.push(violationRulesRef);

  parts.push("");
  parts.push("Required Actions:");
  parts.push("1. Cease all prohibited trading activities immediately");
  parts.push("2. Provide a written explanation within 48 hours");

  parts.push("");
  if (warningNum >= 3) {
    parts.push("Please be advised that further violations may result in immediate account suspension and forfeiture of all profits generated through prohibited trading activity.");
  } else {
    parts.push("Continued violations may result in additional warnings or account suspension.");
  }

  parts.push("");
  parts.push("If you believe this detection is in error, please respond to this email with supporting evidence within 48 hours.");

  parts.push("");
  parts.push("Regards,");
  parts.push("Risk Management Team");

  return { subject, body: parts.join("\n") };
}

// ── Suspension Email ──

function generateSuspensionEmail(account: Account, violation: Violation): GeneratedEmail {
  const subject = `[Suspension] Account ${account.externalId} \u2013 Rule Violation`;
  const parts: string[] = [];

  parts.push(`Dear ${account.name},`);
  parts.push("");
  parts.push(`Your trading account ${account.externalId} has been suspended effective immediately due to confirmed rule violations.`);

  if (account.warningCount > 0) {
    parts.push("");
    parts.push(`You were warned ${account.warningCount} time${account.warningCount > 1 ? "s" : ""} prior to this suspension:`);
    for (const w of account.warningHistory) {
      const tagNames = w.tagsAtWarningTime.map((t) => t.rule).join(", ");
      parts.push(`  ${w.warningNumber}. ${w.sentDate} \u2013 ${tagNames}`);
    }
  }

  const connectedHistory = buildConnectedAccountSection(account);
  if (connectedHistory) {
    parts.push("");
    parts.push(connectedHistory);
  }

  parts.push("");
  parts.push("Current violations:");
  for (const v of account.violations.filter((v) => v.status === "OPEN")) {
    parts.push(`  \u2022 ${v.rule}: ${v.description}`);
  }

  if (account.copyDetection.totalPnl > 0) {
    parts.push("");
    parts.push(`Total P&L from suspicious activity: +$${account.copyDetection.totalPnl.toFixed(2)}`);
  }

  parts.push("");
  parts.push("As per our Terms of Service, any profits generated through prohibited trading practices are subject to forfeiture.");

  parts.push("");
  parts.push("You may appeal this decision within 14 days by responding to this email with supporting evidence.");

  parts.push("");
  parts.push("Regards,");
  parts.push("Risk Management Team");

  return { subject, body: parts.join("\n") };
}

// ── Helper: Prior Warning History ──

function buildPriorWarningSection(account: Account): string | null {
  if (account.warningCount === 0) return null;

  const lines: string[] = [];
  lines.push(
    `This is your ${ordinal(account.warningCount + 1)} formal notice regarding rule violations on this account. Previous warnings were issued:`
  );
  for (const w of account.warningHistory) {
    const tagNames = w.tagsAtWarningTime.map((t) => t.rule).join(", ");
    lines.push(`  ${w.warningNumber}. ${w.sentDate} \u2013 ${tagNames}`);
  }
  return lines.join("\n");
}

// ── Helper: Connected Account History ──

function buildConnectedAccountSection(account: Account): string | null {
  const relevant = account.connectedAccounts.filter(
    (ca) => (ca.warningCount && ca.warningCount > 0) || ca.suspended
  );
  if (relevant.length === 0) return null;

  const lines: string[] = [];
  lines.push("Our records also indicate activity on connected accounts:");
  for (const ca of relevant) {
    if (ca.suspended) {
      lines.push(
        `  \u2022 Account ${ca.id} was suspended on ${ca.suspendedDate || "a previous date"} for ${ca.suspendedReason || "rule violations"}.`
      );
    } else if (ca.warningCount && ca.warningCount > 0) {
      lines.push(
        `  \u2022 Account ${ca.id} has received ${ca.warningCount} warning${ca.warningCount > 1 ? "s" : ""} for rule violations.`
      );
    }
  }
  lines.push("This cross-account pattern has been noted.");
  return lines.join("\n");
}

// ── Helper: Evidence Block ──

function buildEvidenceBlock(violation: Violation, account: Account): string {
  const lines: string[] = [];
  lines.push("Specific findings:");
  lines.push(`  \u2022 ${violation.description}`);

  if (violation.rule === "Copy Trading" && account.copyDetection.totalPnl > 0) {
    lines.push(
      `  \u2022 ${account.copyDetection.suspiciousTrades} of ${account.copyDetection.totalTrades} trades flagged as copies`
    );
    lines.push(
      `  \u2022 P&L from suspected copied trades: +$${account.copyDetection.totalPnl.toFixed(2)}`
    );
    for (const m of account.copyDetection.matches) {
      lines.push(`  \u2022 Matched with ${m.email} (${m.matchCount} match${m.matchCount > 1 ? "es" : ""})`);
    }
  }

  return lines.join("\n");
}

// ── Helper: Rules Reference ──

function buildRulesReference(violation: Violation): string {
  const ruleMap: Record<string, string> = {
    "Copy Trading": "Section 4.2 \u2013 Prohibited Trading Practices",
    "Reverse Hedging": "Section 4.3 \u2013 Prohibited Hedging Strategies",
    "Shared IP Address": "Section 3.1 \u2013 Account Security",
    "Device Anomaly": "Section 3.1 \u2013 Account Security",
    "Device Sharing": "Section 3.1 \u2013 Account Security",
  };
  const section = ruleMap[violation.rule] || "applicable sections";
  return `This activity is in violation of our Terms of Service, ${section}.`;
}

// ── Helper: Ordinal ──

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}