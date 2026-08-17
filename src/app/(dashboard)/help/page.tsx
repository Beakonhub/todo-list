const faqs = [
  {
    q: "How do I add a task?",
    a: "Go to My Task or Dashboard and click \"+ Add task\". Fill in a title, description, priority, status, due date, and optional category or image, then save.",
  },
  {
    q: "What does marking a task as \"Vital\" do?",
    a: "Tap the star icon on any task card to pin it to the Vital Task page — a quick-access view for your most important tasks.",
  },
  {
    q: "How do Task Categories work?",
    a: "Create categories from the Task Categories page to group related tasks. Assign a category when creating or editing a task, and click a category card to see only its tasks in My Task.",
  },
  {
    q: "How do invites work?",
    a: "Click \"+ Invite\" on the Dashboard and enter a collaborator's email. They'll appear as a pending invite in Settings until accepted, after which their avatar shows on your Dashboard.",
  },
  {
    q: "What do the status colors mean?",
    a: "Red means Not Started, blue means In Progress, and green means Completed — the same colors used in the Task Status chart on your Dashboard.",
  },
  {
    q: "Can I change my profile details?",
    a: "Yes — update your name and avatar URL from the Settings page. Your email is fixed since it's used to sign in.",
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-2xl">
      <h2 className="mb-4 text-lg font-semibold">Help &amp; FAQ</h2>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <details key={faq.q} className="group rounded-2xl bg-panel p-4 shadow-sm">
            <summary className="cursor-pointer list-none font-medium">
              {faq.q}
            </summary>
            <p className="mt-2 text-sm text-foreground/60">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
