export interface EmailTemplateResult {
  subject: string;
  text: string;
  html: string;
}

const BASE_STYLES = `
  body { margin: 0; padding: 0; background-color: #FFE600; font-family: 'Poppins', 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #000000; }
  .wrapper { width: 100%; background-color: #FFE600; padding: 32px 16px; box-sizing: border-box; }
  .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 3px solid #000000; box-shadow: 6px 6px 0 #000000; padding: 32px; box-sizing: border-box; }
  .header { border-bottom: 3px solid #000000; padding-bottom: 20px; margin-bottom: 24px; }
  .logo { font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; color: #000000; margin: 0; }
  .badge { display: inline-block; background-color: #000000; color: #FFE600; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 8px; margin-top: 8px; letter-spacing: 0.05em; font-family: monospace; }
  .title { font-size: 26px; font-weight: 900; text-transform: uppercase; margin: 0 0 16px 0; line-height: 1.15; color: #000000; }
  .lead { font-size: 16px; font-weight: 500; line-height: 1.6; color: #111827; margin: 0 0 20px 0; }
  .quote-box { background-color: #FEF9C3; border: 2px solid #000000; padding: 16px; margin: 20px 0; font-style: italic; font-size: 14px; font-weight: 600; box-shadow: 3px 3px 0 #000000; }
  .btn-container { margin: 28px 0; }
  .btn { display: inline-block; background-color: #E10600; color: #FFFFFF !important; font-weight: 800; text-transform: uppercase; text-decoration: none; padding: 14px 28px; border: 3px solid #000000; box-shadow: 4px 4px 0 #000000; font-size: 14px; letter-spacing: 0.05em; }
  .footer { margin-top: 32px; padding-top: 20px; border-top: 2px solid #000000; font-size: 12px; font-family: monospace; color: #4B5563; line-height: 1.5; }
  .footer-highlight { font-weight: 700; color: #000000; text-transform: uppercase; }
`;

export function getVerificationEmailTemplate(confirmUrl: string): EmailTemplateResult {
  const subject = "Verify your email for The Unbias";
  const text = `
VERIFY YOUR EMAIL ADDRESS — THE UNBIAS

Click the link below to confirm your account and start auditing your decisions:
${confirmUrl}

If you did not request this email, no action is needed.

The Unbias — AI decision-audit workspace that never decides for you.
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="logo">THE UNBIAS</h1>
        <div class="badge">EMAIL CONFIRMATION</div>
      </div>
      <h2 class="title">VERIFY YOUR EMAIL TO ACTIVATE YOUR WORKSPACE</h2>
      <p class="lead">
        Welcome to <strong>The Unbias</strong>. Before you can inspect your first reasoning map, please verify your email address.
      </p>
      <div class="quote-box">
        &ldquo;The AI does not give you a better answer. It helps you notice the answer you were already smuggling in.&rdquo;
      </div>
      <div class="btn-container">
        <a href="${confirmUrl}" class="btn" target="_blank">CONFIRM MY EMAIL →</a>
      </div>
      <p style="font-size: 13px; color: #6B7280; margin-top: 20px;">
        Or copy and paste this link in your browser:<br>
        <span style="font-family: monospace; word-break: break-all; color: #000000;">${confirmUrl}</span>
      </p>
      <div class="footer">
        <div class="footer-highlight">Private by default · No recommendations</div>
        <div>Your decisions belong exclusively to you. Avoid sharing this verification link.</div>
      </div>
    </div>
  </div>
</body>
</html>
`.trim();

  return { subject, text, html };
}

export function getWelcomeSignupEmailTemplate(dashboardUrl: string, name?: string): EmailTemplateResult {
  const subject = "Welcome to The Unbias: Your Reasoning Workspace";
  const greeting = name ? `Welcome, ${name}!` : "Welcome!";
  const text = `
${greeting.toUpperCase()} — THE UNBIAS

Your decision-audit workspace is ready.

3 Core Principles of The Unbias:
1. We NEVER choose for you — no AI verdict, no recommended option.
2. Every blind-spot hypothesis quotes your exact stated words.
3. Your Readiness Score measures the thoroughness of your inquiry, not whether an option is right.

Get started by inspecting your first decision:
${dashboardUrl}

The Unbias — See the decision you are actually making.
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="logo">THE UNBIAS</h1>
        <div class="badge">WORKSPACE ACTIVATED</div>
      </div>
      <h2 class="title">${greeting.toUpperCase()}</h2>
      <p class="lead">
        Your personal decision-audit workspace is active. You can now turn any complicated dilemma into an empirical reasoning map.
      </p>
      <div style="background-color: #F3F4F6; border: 2px solid #000000; padding: 16px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase;">How to get the most value:</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
          <li><strong>Load the Sample Decision</strong> in the dashboard to see an audit in action.</li>
          <li><strong>Triage Blind Spots</strong> on the Kanban board (Relevant, Already Considered, Not Relevant).</li>
          <li><strong>Convert Risks into Actions</strong> so uncertainty is resolved with real evidence.</li>
        </ul>
      </div>
      <div class="btn-container">
        <a href="${dashboardUrl}" class="btn" target="_blank">OPEN YOUR DASHBOARD →</a>
      </div>
      <div class="footer">
        <div class="footer-highlight">The Unbias Core Promise</div>
        <div>We provide hypotheses, not verdicts. You retain 100% of your agency.</div>
      </div>
    </div>
  </div>
</body>
</html>
`.trim();

  return { subject, text, html };
}

export function getReportEmailTemplate(
  decisionTitle: string,
  shareUrl?: string
): EmailTemplateResult {
  const subject = "Your Unbias Decision Report";
  const text = `
Your decision reflection is ready.

Decision: ${decisionTitle}

This report includes:
- Assumptions to examine
- Evidence gaps
- Pre-mortem risks
- Questions worth answering
- Your action plan

The Unbias did not make the decision for you. It helped you inspect the reasoning behind it.

${shareUrl ? `Open your secure report: ${shareUrl}` : ""}
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="logo">THE UNBIAS</h1>
        <div class="badge">DECISION REPORT AUDIT</div>
      </div>
      <h2 class="title">YOUR REASONING AUDIT REPORT IS READY</h2>
      <p class="lead">
        Your decision audit for <strong>&ldquo;${decisionTitle}&rdquo;</strong> has been compiled.
      </p>
      <div style="background-color: #F3F4F6; border: 2px solid #000000; padding: 18px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; font-family: monospace;">Report Highlights Attached:</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
          <li>Assumptions surfaced and quoted from your text</li>
          <li>Key evidence gaps and verification questions</li>
          <li>Pre-mortem timeline and failure modes</li>
          <li>Comprehensive evidence action plan</li>
        </ul>
      </div>
      ${
        shareUrl
          ? `<div class="btn-container"><a href="${shareUrl}" class="btn" target="_blank">VIEW SECURE REPORT →</a></div>`
          : ""
      }
      <div class="quote-box">
        The Unbias does not decide for you. It helps you see the assumptions, questions, and evidence behind your decision.
      </div>
      <div class="footer">
        <div class="footer-highlight">CONFIDENTIAL &amp; PRIVATE</div>
        <div>This report was requested by your account. The PDF document is attached to this email.</div>
      </div>
    </div>
  </div>
</body>
</html>
`.trim();

  return { subject, text, html };
}

export function getReminderEmailTemplate(
  kind: "deadline" | "one_day_before" | "one_week_before" | "evidence_action" | "revisit",
  decisionTitle: string,
  revisitUrl: string,
  extraDetails?: { actionTitle?: string }
): EmailTemplateResult {
  let subject = `Decision Reminder: ${decisionTitle}`;
  let title = "REASONING CHECKPOINT";
  let body = "It's time to check in on your decision.";

  switch (kind) {
    case "revisit":
      subject = "Revisit your decision reflection";
      title = "REVISIT YOUR DECISION REFLECTION";
      body = `
        You planned to revisit your decision today.<br><br>
        • Have any of your open questions been answered?<br>
        • Have any assumptions changed?<br>
        • Would your current view be different now?
      `;
      break;
    case "deadline":
      subject = `Deadline Today: ${decisionTitle}`;
      title = "YOUR DECISION DEADLINE IS TODAY";
      body = "Your targeted decision deadline has arrived. Check your Evidence Action Kanban to ensure your critical uncertainties have been investigated.";
      break;
    case "one_day_before":
      subject = `1 Day Until Deadline: ${decisionTitle}`;
      title = "24 HOURS BEFORE DECISION DEADLINE";
      body = "You have 24 hours remaining before your scheduled decision deadline. Review your remaining high-priority evidence actions.";
      break;
    case "one_week_before":
      subject = `1 Week Until Deadline: ${decisionTitle}`;
      title = "7 DAYS BEFORE DECISION DEADLINE";
      body = "You are one week away from your target decision date. Check whether your pace matches your required evidence investigation minutes.";
      break;
    case "evidence_action":
      subject = `Action Due: ${extraDetails?.actionTitle || decisionTitle}`;
      title = "EVIDENCE ACTION DUE TODAY";
      body = `Your scheduled investigation <strong>&ldquo;${extraDetails?.actionTitle}&rdquo;</strong> is due for review today.`;
      break;
  }

  const text = `
${title} — THE UNBIAS
Decision: ${decisionTitle}

${body.replace(/<br>/g, "\n").replace(/<[^>]+>/g, "")}

Open your decision in The Unbias:
${revisitUrl}
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="logo">THE UNBIAS</h1>
        <div class="badge">SCHEDULED REMINDER</div>
      </div>
      <h2 class="title">${title}</h2>
      <p style="font-size: 14px; font-weight: bold; margin-bottom: 16px;">
        DECISION: ${decisionTitle}
      </p>
      <div class="lead">
        ${body}
      </div>
      <div class="btn-container">
        <a href="${revisitUrl}" class="btn" target="_blank">OPEN YOUR DECISION →</a>
      </div>
      <div class="footer">
        <div class="footer-highlight">Reminders Worker · The Unbias</div>
        <div>You can manage reminder frequencies or disable emails at any time in Settings.</div>
      </div>
    </div>
  </div>
</body>
</html>
`.trim();

  return { subject, text, html };
}
