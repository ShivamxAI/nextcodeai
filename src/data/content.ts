export const MARKETPLACE_URL = "https://marketplace.visualstudio.com/";
export const GITHUB_URL = "https://github.com/ShivamxAI/nextcode";
export const content = {
  name: "NextCode",
  title: "NextCode — Your code. Your choice.",
  description:
    "AI code completion for VS Code. Keep your code local with Ollama, or choose your cloud provider. Your code, your key, your choice.",
  nav: [
    { id: "try-it", label: "Try it" },
    { id: "modes", label: "Two modes" },
    { id: "how-it-works", label: "How it works" },
    { id: "report", label: "The report" },
    { id: "roadmap", label: "Roadmap" },
  ],
  hero: {
    eyebrow: "AI CODE COMPLETION. ON YOUR TERMS.",
    headline: "Code completion where you decide",
    accent: "where your code goes.",
    description:
      "Local on your machine. Or a cloud provider you choose.\nSame effortless suggestions. You stay in control.",
    install: "Install from VS Code Marketplace",
    github: "View on GitHub",
    report: "Read the report",
    footnote: "Open source. Your own API key. No hidden detours.",
    scroll: "LESS FRICTION. MORE FLOW.",
    file: "hello.py",
    branch: "main",
    status: "NextCode · Local",
    language: "Python",
    ghost: "AI suggestion",
    accepted: "Suggestion accepted",
  },
  demo: {
    eyebrow: "01 / GIVE IT A SPIN",
    title: "A little less typing. A little more flow.",
    description: "Six languages. One familiar feeling.",
    notice: "Simulated demo, not the real model.",
    accept: "Accept suggestion",
    next: "Next snippet",
    reset: "Reset",
    accepted: "Accepted. Keep the flow going.",
    waiting: "A suggestion, right where you need it.",
  },
  modes: {
    eyebrow: "02 / YOUR CODE. YOUR CALL.",
    title: "Two modes. One clear boundary.",
    description: "Good suggestions shouldn’t come at the cost of control.",
    local: "Local",
    cloud: "Cloud",
    editor: "Your editor",
    localHost: "Ollama on localhost",
    localBadge: "Your code stays here",
    cloudBadge: "Sent to a third party",
    consent: "Explicit consent",
    provider: "Chosen provider",
    localDescription:
      "Your editor talks to a model running on your own machine. No code leaves it.",
    cloudDescription:
      "Only context around your cursor is sent to the provider you select, using your own API key.",
    consentTitle: "Cloud consent dialog",
    draft: "Draft wording · awaiting confirmation",
    consentText:
      "Allow NextCode to send code around your cursor to {provider} at {host}? Requests use your own API key. This code will leave your machine and be processed by a third party. Consent applies only to this provider and host. You can withdraw consent at any time.",
    cancel: "Cancel",
    allow: "Allow for this provider & host",
  },
  story: {
    eyebrow: "03 / BEHIND THE GHOST TEXT",
    title: "From a keystroke to your next line.",
    description: "Just enough context. Just when you need it.",
    steps: [
      {
        title: "You type.",
        detail: "Write code as usual. NextCode waits quietly in the background.",
      },
      {
        title: "A short pause.",
        detail: "Debouncing gives your thoughts room to catch up before a request starts.",
      },
      {
        title: "Context on both sides.",
        detail: "The code before and after your cursor helps the model fill the right gap.",
      },
      {
        title: "Fill in the middle.",
        detail:
          "A fill-in-the-middle prompt asks the model for the missing code, not a whole new file.",
      },
      {
        title: "The model completes.",
        detail: "Ollama locally, or your chosen cloud provider after consent.",
      },
      {
        title: "Ghost text appears.",
        detail: "An italic suggestion sits inline, without interrupting your typing.",
      },
      {
        title: "Tab. And keep going.",
        detail: "Accept the suggestion with Tab, or keep typing your own version.",
      },
    ],
    lineTitle: "Mid-line → one line",
    lineDescription: "A suggestion completes the line you’re on.",
    blockTitle: "Fresh line → several lines",
    blockDescription: "A fresh line or the end of a block opener may get a multi-line suggestion.",
  },
  privacy: {
    eyebrow: "04 / PRIVACY IS A SETTING YOU OWN",
    title: "Nothing behind your back.",
    description: "Control is built into the request—not buried in the fine print.",
    items: [
      {
        title: "Your keys, safely stored.",
        description:
          "API keys live in VS Code’s secret storage, not in your code or settings files.",
      },
      {
        title: "Consent has boundaries.",
        description:
          "Consent is bound to a specific provider and host. Change either, and consent is required again.",
      },
      {
        title: "Change your mind anytime.",
        description:
          "Withdraw cloud consent whenever you want. Your next request respects that choice.",
      },
      {
        title: "Secrets get a second look.",
        description:
          "The cloud privacy filter skips .env and key files, and checks for secret-looking text.",
      },
      {
        title: "Stay in your flow.",
        description:
          "Errors never pop up while you’re typing. No interruption for a failed suggestion.",
      },
    ],
    note: "The secret filter is pattern-based, not a guarantee. Review what you share and avoid sending sensitive code.",
  },
  setup: {
    eyebrow: "05 / SMALL SETUP. BIG DIFFERENCE.",
    title: "Set up in minutes.",
    local: [
      { title: "Install NextCode", description: "Add the extension from the VS Code Marketplace." },
      { title: "Choose Local mode", description: "Run the Ollama installer once on your machine." },
      {
        title: "Let the guided setup take over",
        description: "NextCode detects Ollama and downloads the model with a progress bar.",
      },
    ],
    cloud: [
      {
        title: "Choose your provider",
        description: "Pick Gemini, Claude, OpenAI, or an OpenAI-compatible API.",
      },
      {
        title: "Pick a model & give consent",
        description: "Select a valid model and approve sharing for that provider and host.",
      },
      {
        title: "Bring your own API key",
        description: "Paste your key into NextCode. It’s saved in VS Code’s secret storage.",
      },
    ],
    download: "Qwen2.5-Coder 1.5B",
    progress: "Guided setup preview",
    progressButton: "Simulate model download",
    complete: "Model ready · simulated",
    localNote: "Local mode requires running the Ollama installer once.",
    cloudNote: "Cloud mode requires your own API key. Provider usage charges may apply.",
  },
  models: {
    eyebrow: "06 / PICK YOUR ENGINE",
    title: "Different models. The same control.",
    localTitle: "On your machine",
    localModel: "Qwen2.5-Coder 1.5B",
    localDetail: "Fill-in-the-middle · served by Ollama",
    cloudTitle: "With your provider",
    providers: ["Gemini", "Claude", "OpenAI", "OpenAI-compatible"],
    note: "NextCode uses pre-trained models. No model training has been done.",
  },
  report: {
    eyebrow: "07 / THE CODESEARCHNET REPORT",
    title: "Less hype. More evidence.",
    description: "Same functions. Same missing code. An honest look at what comes back.",
    method:
      "We take real functions from the CodeSearchNet test split, hide a piece, and ask each provider to fill it in. Every provider gets the same tasks with a fixed seed, across Python, Java, JavaScript, Go, Ruby, and PHP.",
    line: "LINE TASK",
    lineDescription: "Complete the rest of one line.",
    block: "BLOCK TASK",
    blockDescription: "Fill in 2–4 missing lines.",
    metrics:
      "Exact match with 95% confidence intervals · First-line match · Edit similarity · Empty rate · Latency p50 & p95",
    emptyTitle: "Results coming soon",
    emptyDescription:
      "No numbers until there are real numbers. The explorer will appear here when benchmark results are available.",
    emptyBadge: "AWAITING BENCHMARK DATA",
    provider: "Provider",
    task: "Task type",
    language: "Language",
    all: "All",
    download: "Download CSV",
    chart: "Exact match by provider",
    table: "Benchmark results",
    noMatches: "No results match these filters.",
    read: "How to read this",
    caveats: [
      {
        title: "Exact match is a tough grader.",
        text: "A correct answer written differently still counts as wrong. Read exact match alongside edit similarity and first-line match.",
      },
      {
        title: "Small samples mean wide intervals.",
        text: "The 95% confidence interval shows uncertainty, not a guarantee. Early results use small samples.",
      },
      {
        title: "Local and cloud latency are different stories.",
        text: "Local CPU latency is far above cloud latency. Compare p50 and p95 with the hardware and provider in mind.",
      },
      {
        title: "The dataset has history.",
        text: "CodeSearchNet is old, public GitHub code under various licences, including some Python 2. This evaluation uses an unofficial parquet re-upload of CodeSearchNet.",
      },
    ],
  },
  roadmap: {
    eyebrow: "08 / WHAT COMES NEXT",
    title: "A direction, not a promise.",
    description: "The next questions we want to answer. Built in the open.",
    note: "Statuses are provisional until confirmed by the maintainer.",
  },
  limitations: {
    eyebrow: "09 / THE FINE PRINT, UP FRONT",
    title: "Still early. Still honest.",
    items: [
      "CPU-only local mode takes seconds per suggestion.",
      "VS Code’s API cannot report rejections or partial accepts.",
      "Model names change; you may need to set a valid one.",
      "Claude and OpenAI paths are less tested than Gemini.",
      "Early benchmark results use small samples.",
    ],
  },
  faq: {
    eyebrow: "10 / A FEW GOOD QUESTIONS",
    title: "Before you hit Tab.",
    items: [
      {
        q: "Does my code leave my machine?",
        a: "In Local mode, no. In Cloud mode, code around your cursor goes to your chosen third-party provider only after explicit consent.",
      },
      {
        q: "Do I need a GPU?",
        a: "No. Ollama can run locally on a CPU, but suggestions may take seconds. A compatible GPU can help. Cloud mode runs at your provider.",
      },
      {
        q: "Do I need an API key?",
        a: "Not for Local mode. Cloud mode requires your own key for your chosen provider, and provider charges may apply.",
      },
      {
        q: "Which languages work?",
        a: "The simulated demo and report cover Python, JavaScript, Java, Go, Ruby, and PHP. Suggestions depend on the selected pre-trained model.",
      },
      {
        q: "How do I update?",
        a: "Update NextCode through VS Code’s Extensions panel. Check the GitHub changelog for changes and model configuration updates.",
      },
    ],
  },
  footer: {
    headline: "Your next line. Your choice.",
    by: "Built by Shivam.",
    github: "GitHub",
    marketplace: "Marketplace",
    changelog: "Changelog",
    note: "Made for the flow. Built in the open.",
  },
};
export const snippets: Record<string, { code: string; ghost: string; file: string }[]> = {
  Python: [
    {
      file: "utils.py",
      code: "def greet(name: str) -> str:\n    ",
      ghost: 'return f"Hello, {name}!"',
    },
    { file: "utils.py", code: "def is_even(number):\n    ", ghost: "return number % 2 == 0" },
    {
      file: "utils.py",
      code: "def unique(items):\n    ",
      ghost: "return list(dict.fromkeys(items))",
    },
  ],
  JavaScript: [
    { file: "utils.js", code: "function greet(name) {\n  ", ghost: "return `Hello, ${name}!`;\n}" },
    { file: "utils.js", code: "const isEven = (number) => ", ghost: "number % 2 === 0;" },
  ],
  Java: [
    {
      file: "Utils.java",
      code: "public String greet(String name) {\n    ",
      ghost: 'return "Hello, " + name + "!";\n}',
    },
    {
      file: "Utils.java",
      code: "public boolean isEven(int number) {\n    ",
      ghost: "return number % 2 == 0;\n}",
    },
  ],
  Go: [
    {
      file: "utils.go",
      code: "func greet(name string) string {\n    ",
      ghost: 'return "Hello, " + name + "!"\n}',
    },
    {
      file: "utils.go",
      code: "func isEven(number int) bool {\n    ",
      ghost: "return number % 2 == 0\n}",
    },
  ],
  Ruby: [
    { file: "utils.rb", code: "def greet(name)\n  ", ghost: '"Hello, #{name}!"\nend' },
    { file: "utils.rb", code: "def even?(number)\n  ", ghost: "number % 2 == 0\nend" },
  ],
  PHP: [
    {
      file: "utils.php",
      code: "function greet($name) {\n    ",
      ghost: 'return "Hello, " . $name . "!";\n}',
    },
    {
      file: "utils.php",
      code: "function isEven($number) {\n    ",
      ghost: "return $number % 2 === 0;\n}",
    },
  ],
};
