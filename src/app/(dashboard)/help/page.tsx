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
    a: "The brick-red tab means Not Started, amber means In Progress, and teal means Completed — the same colors used in the Task Status gauges on your Dashboard.",
  },
  {
    q: "Can I change my profile details?",
    a: "Yes — update your name and avatar URL from the Settings page. Your email is fixed since it's used to sign in.",
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-2xl">
      <h2 className="mb-4 font-display text-lg font-semibold text-strip">Help &amp; FAQ</h2>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <details key={faq.q} className="group rounded border border-board-line bg-board-raised p-4">
            <summary className="cursor-pointer list-none font-medium text-strip">
              {faq.q}
            </summary>
            <p className="mt-2 text-sm text-strip/50">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
