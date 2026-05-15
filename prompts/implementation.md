# Prompts for implementing features from roadmap.md
Adjust text within curly braces '{}' as needed. Steps for the user are preceded with '>'. Provide one step at a time to the AI.

## Steps

> Move from build to plan mode

What is needed to complete step {4.4} in docs/roadmap.md ? Read only docs/design.md 

---

What components from shadcn could be used? List components that could be installed from the list here: https://ui.shadcn.com/docs/components

---

> Install suggested components: npx shadcn@latest add {card}

---

> Update app-xml/: npm run generate:xml

---

Follow the instructions in prompts/efficient-explore.md.

What files would need to be modified or created?

---

Follow the instructions in prompts/coding.md.

Show all the edits needed for all files.

---

> Move from plan to build mode

Follow the instructions in AGENTS.md.

Proceed with the implementation.

---

> Move from build to plan mode

Follow the instructions in prompts/coding.md.

Identify possible refactors for {file}

---

Follow the instructions in prompts/document.md.

Modify {app/components/points-celebration.tsx}

---

In {file}, what tests are needed to cover line 25 and line 28?