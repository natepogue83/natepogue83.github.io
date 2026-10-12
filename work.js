// Everything on the site comes from this file.
// To add a piece of work, copy one block inside WORK (from { to },), paste it at the top, and change the text.
// section is one of: experiments, research, builds, games (the page groups work under those headings).
// featured: true puts it first in its section and shows its findings open instead of folded.
// Fields you don't need can be left out. Links with url: "" show as "coming soon".

window.SITE = {
  name: "Nathan Pogue",
  role: "AI safety research and evaluation",
  intro:
    "I run small, pre-registered experiments on whether AI models are honest about where their information came from, " +
    "for example when they cite a document or when an agent rewrites its notes for another agent. I choose the questions, work out the designs with AI agents, have the agents build the experiments and their graders, " +
    "and check every result against the data before it goes out. Several of the results below are negative.",
  why:
    "Since I was a kid I've dreamed of a science-fiction future where AI and robots work as partners with people, and together we do things we once thought were impossible. I'm excited for that future, but it only happens if AI is aligned with humanity's goals, and that means we also have to decide what those goals are and what matters most to us. If we get that wrong, the results could be disastrous. I think we can get it right as long as enough people are willing to fight for it, and I want to be one of them.",
  next: {
    label: "What I'd work on next",
    title: "Trust creep: do AI monitors go easier on an agent with a clean track record?",
    text:
      "Monitors would review the same set of planted policy violations in a sandbox of devops tasks, with and without a stated or demonstrated good record, " +
      "to measure whether a good record lowers suspicion, and whether a second check that never sees the record catches violations the record-aware monitor lets through. " +
      "For AI control, the risk is that a misaligned agent could exploit oversight that relaxes as an agent earns trust. " +
      "It runs on API calls in a sandbox, and would cost about $300 without flagship models as monitors, or about $800 if every factor is fully crossed, before two factors the plan has not yet budgeted."
  },

  // Leave url empty to hide a contact link.
  contact: [
    { label: "natepogue83@gmail.com", url: "mailto:natepogue83@gmail.com" },
    { label: "GitHub", url: "https://github.com/natepogue83" },
    { label: "LinkedIn", url: "" },
    { label: "Résumé", url: "" }
  ],
  photo: "" // a photo in images/, e.g. "images/me.jpg"
};

window.WORK = [
  {
    id: "isnad",
    section: "experiments",
    featured: true,
    kind: "Experiment",
    date: "October 2026",
    title: "Do AI models tell the truth about where their answers came from?",
    payoff:
      "Document chat tools show citations, and people trust a cited answer more. " +
      "This study measured how often that citation is real document text attached to an " +
      "answer the model actually got from memory, and tested a prompt change that removes most of it without any extra API calls.",
    facts: [
      ["Models", "5 (Claude Opus, Sonnet, Haiku 5.5; GPT-5.5; GPT-5.4 mini)"],
      ["Responses", "5,880 scored, plus a 1,080-call follow-up"],
      ["API cost", "About $19 in total"],
      ["Grader", "Deterministic string checks with a regression test suite"]
    ],
    chart: {
      caption:
        "Questions the document never answers (54 per model), with the model allowed to answer from memory. Bars show answers presented as coming from the document, so lower is better; whiskers are 95% intervals.",
      groups: ["Plain citation", "Labeled source chain"],
      n: 54, // questions per model; draws 95% intervals as whiskers
      unit: "questions per model",
      rows: [
        ["Claude Opus 5.5", 18, 0],
        ["Claude Sonnet 5.5", 13, 0],
        ["Claude Haiku 5.5", 14, 0],
        ["GPT-5.5", 5, 0],
        ["GPT-5.4 mini", 14, 4]
      ]
    },
    findings: [
      "With a plain citation field, every model sometimes answered from memory while citing a real quote from the document: from 9% of these questions (GPT-5.5) to 33% (Claude Opus 5.5). The documents were built never to contain these answers, so no quote could support them, yet a \"does this quote exist?\" check passes every one.",
      "The Claude models nearly always said in a side note that the answer came from general knowledge. The GPT models usually left the note blank.",
      "Asking the model to label each part of its answer as document, memory or inference, with a direct instruction that recalled facts are memory, cut this to zero for four of the five models and from 26% to 7% for GPT-5.4 mini.",
      "A pre-registered follow-up gave every format the same, stronger instruction. That was enough on its own for Claude Sonnet but did little for GPT-5.4 mini, where only the labeled chain clearly reduced the false citations its side note didn't disclose.",
      "All of GPT-5.4 mini's remaining failures used the \"inference\" label, presenting remembered or made-up facts as inferences from the document."
    ],
    method: [
      "294 test items, each a document and a question, built so the true source of the answer is known: in the document, only in memory, an inference, a conflict with memory, or unanswerable.",
      "Scored by deterministic string matching against planted answers, with no AI judge for the main measures. A regression suite lists correct variants the grader must accept and near-misses it must reject.",
      "An outside review by a separate agent found real grader problems, including a correct \"Hawaiʻi\" answer scored wrong. Each point was checked against the saved data before anything was fixed, and the write-up lists what changed and why."
    ],
    limits:
      "One pass on 54 well-known facts per model, on synthetic documents. It shows these behaviors exist and that a cheap prompt reduces them; it doesn't rank models in general or show how this holds on real, messy documents.",
    prior:
      "Earlier work showed citations that don't reflect what an answer rests on, and models answering from memory despite document-only rules. A search of about 350 queries found no prior count of current models attaching real quotes to remembered answers, or of self-reported source labels checked against a known source.",
    links: [
      { label: "Findings page", url: "https://claude.ai/artifact/BZDWSycKcVT2n5mUxdif1g" },
      { label: "Full write-up", url: "https://github.com/natepogue83/isnad/blob/main/isnad-experiment/FINDINGS.md" },
      { label: "Code and data", url: "https://github.com/natepogue83/isnad/tree/main/isnad-experiment" }
    ],
    tags: ["evals", "grading", "citations", "pre-registration"]
  },
  {
    id: "isnad-hops",
    section: "experiments",
    featured: true,
    kind: "Pilot experiment",
    date: "October 2026",
    title: "Keeping track of who said what when Claude rewrites its own handoff notes",
    payoff:
      "A follow-up to the citation study above. Agents on long tasks pass notes to themselves and to other agents, and if a colleague's unchecked claim " +
      "turns into \"I saw this\" along the way, the next agent may act on it as if it had been checked. In this pilot, Claude models rewrote notes twice, " +
      "starting from notes where the source of every fact was known. None of the rewrites presented a colleague's claim or a guess as something the agent had seen. " +
      "Haiku's plain notes did stop marking about half of what the user had said as coming from the user, and one added sentence in the prompt fixed that.",
    facts: [
      ["Models", "Haiku\u00a05.5 and Opus\u00a05.5 as writers; Sonnet\u00a05.5 as reader"],
      ["Rewrites", "672, across 6 made-up work scenarios"],
      ["API cost", "$7.42, under a $10 cap set in advance"],
      ["Before the main run", "110 offline tests; code reviewed by two separate AI agents"]
    ],
    chart: {
      caption:
        "User statements the reader no longer credited to the user after two rewrites; lower is better. Both formats had the same 300-word limit. " +
        "Whiskers are 95% intervals that treat all 96 statements as independent, so they are somewhat too narrow.",
      groups: ["Plain notes", "Told to say how each fact was obtained"],
      n: 96,
      unit: "user statements",
      rows: [
        ["Claude Haiku 5.5", 51, 1],
        ["Claude Opus 5.5", 1, 0]
      ]
    },
    findings: [
      "Across 672 rewrites, the reader never took a colleague's unverified claim or the agent's own guess for something the agent had seen itself (0 of 2,688 such facts). Three colleague claims in Haiku's notes were read as coming from the user. Adding technical detail to a claim, such as a metric name or a file path, didn't make either happen more often.",
      "Haiku carried nearly all of the user's facts through both rewrites but lost track of which ones came from the user. In plain notes it often filed the user's statements under headings like \"Reported, not verified\" next to colleagues' claims, or dropped who said them. After two rewrites the reader credited only 45 of 96 user statements to the user: 33 had no source left, 17 were read as a colleague's and 1 was dropped from the notes. Opus kept 95. The mistake errs toward caution, but the next agent can no longer tell what the user asked for from what a colleague said.",
      "Adding one sentence to the prompt, \"For each fact, say how it was obtained and whether it has been verified\", brought Haiku back to 95 of 96. A JSON handoff with a source field on every claim kept all 96 for both models.",
      "Detail did sway the reader when there was no label to go on. With every source label stripped from the original notes, the reader assumed the agent had seen 12 of 192 claims that carried detail, and none of the 192 plain ones."
    ],
    method: [
      "Six made-up scenarios (an on-call incident, a revenue mismatch, a vendor choice, a flaky CI job, a double charge and a freezer failure) each have 8 facts with known sources: the agent's own tool output, the user, a colleague's unverified document, or the agent's guess. Half the facts also carry technical detail such as a metric name, file path or job id. Each scenario comes in 8 versions so that every fact appears once under every source, with and without detail, and the wording of a fact can't explain a difference.",
      "Haiku and Opus each rewrote the notes as a handoff for another agent, then rewrote their own handoff. They used three formats: plain notes with a 300-word limit, the same with one added sentence asking how each fact was obtained, and JSON with a source field on every claim. Haiku also wrote plain notes with a 120-word limit. Sonnet 5.5, which wrote none of the notes, read every version and reported where the notes said each fact came from. On the original notes it read all 768 source labels correctly.",
      "The design, the pass/fail checks and the $10 cap were written down and the code was frozen by file hash before the main run. A smoke test and a closed-book check, $0.67 together, came first, and the pre-registration lists what changed after them. The runner estimated each round's cost before sending it, and tests checked that an interrupted run or a lost reply could not make it pay twice."
    ],
    limits:
      "A pilot: 6 scenarios written by a Claude agent, two rewrites, one model family and one reader model. The notes started out correctly labeled. Real agents write their first notes from messy tool output, and mislabeling may start there; this pilot didn't test that. A run three times larger would cost about $20 at batch prices.",
    prior:
      "Hu (2026) found that summarizers drop \"unverified\" tags, and Xu et al. (2026) found that memory consolidation can turn outside content into what looks like the user's own history, both mostly over a single rewrite. Kwon (2026) described rewrites that keep a claim but drop who said it, and built detectors for them. " +
      "Ye et al. (2026) showed that models judge where text came from by how it reads more than by its label. Here the reader followed the label on all 768 labeled original facts, detailed or not, and detail swayed it only once the labels were stripped. " +
      "After two rewrites, the reader still took 656 of 672 colleague claims as a colleague's. The drift mostly ran the other way, with the user's own statements losing their label or being filed with colleagues' claims.",
    links: [
      { label: "Write-up", url: "https://github.com/natepogue83/isnad/blob/main/isnad-hops/FINDINGS.md" },
      { label: "Code and data", url: "https://github.com/natepogue83/isnad/tree/main/isnad-hops" }
    ],
    tags: ["agents", "source tracking", "handoffs", "pre-registration", "negative results"]
  },
  {
    id: "sts-ai",
    section: "experiments",
    kind: "Experiment",
    date: "July 2026",
    title: "Training a Slay the Spire 2 AI under stopping rules set in advance",
    payoff:
      "Slay the Spire 2 is a deck-building card game in which each run climbs floor by floor through random fights. " +
      "The agent learned to play it. Every test of an improvement had a pass gate and a stop rule fixed in advance, so results couldn't be tuned after the fact, and work stopped when the tests failed.",
    facts: [
      ["Model", "Set-based network that scores legal moves"],
      ["Training", "Imitation of a rule-based strategy, then DAgger"],
      ["Search test", "200 pre-registered paired games"],
      ["Tests", "162 passing"]
    ],
    findings: [
      "The learned policy matched the rule-based strategy's move on 83% of held-out combat decisions, and 86% after a round of DAgger (retraining on positions the agent reached itself, labeled by the strategy).",
      "Adding one-step look-ahead search made it worse: mean floor reached fell from 8.69 to 8.21 (paired difference −0.48, 95% interval −0.72 to −0.24), and it was worse for every character. The pre-set gate failed, so the configuration was dropped without re-tuning.",
      "A test of replaying games with identical randomness found that repeat branches reproduced exactly in 48 of 48 cases. The pre-set gate still failed at the shortest horizons, so the longer horizons that passed were not picked after the fact.",
      "A code audit by four parallel agents found a bug that mislabeled potions after one was used and a resume bug that could stall runs, and made leakage of future cards into the training data measurable."
    ],
    limits:
      "The agent doesn't yet beat its own rule-based teacher. The search result rules out this search setup, not search in general.",
    links: [{ label: "Code and benchmarks", url: "https://github.com/natepogue83/sts2-ai" }],
    tags: ["agents", "benchmarks", "pre-registration", "negative results"]
  },
  {
    id: "compression-realness",
    section: "experiments",
    kind: "Experiment",
    date: "December 2025 – July 2026",
    title: "Can file compression tell real data from fake? Tested on turbulence, chatbots and markets",
    payoff:
      "These tests asked where compression, as a general measure of structure in data, is useful in practice, including for catching chatbot hallucinations. " +
      "Where it could, each test compared it against the cheap specialist check that field already uses.",
    facts: [
      ["Turbulence data", "Johns Hopkins Turbulence Database"],
      ["Method", "Compressed size vs. fakes with the same spectrum and values"],
      ["Domains", "Turbulence, LLM answers, financial prices, AI images"]
    ],
    findings: [
      "In 12 of 12 random 3D turbulence cubes, the real field compressed smaller than every fake built to match its value distribution and power spectrum: about 11% smaller on average at full resolution, shrinking to under 1% when coarsened 4×.",
      "A later re-check found that a simpler 2026 version of the test overstated the effect for vorticity by about half, because its fakes didn't keep the heavy tails of the real values. With that fixed, the gap was a steady 18% to 21%. Turbulence's non-Gaussian structure is well known, so this validates the tool rather than discovering new physics.",
      "On markets, re-run from the saved data, autocorrelation detected volatility clustering in 26 to 44 of 55 one-year NASDAQ windows; compression detected 2. On AI images it scored AUC 0.58, which is consistent with chance. For hallucination detection it scored AUC 0.85 once answer length was controlled, behind a simple count of distinct answers at 0.92.",
      "Overall, compression tied with or lost to the field's own cheap baseline everywhere it was compared (markets, answer grounding, hallucination). Turbulence gave the only clean signal, but it hasn't yet been tested against that field's cheap checks."
    ],
    limits:
      "The turbulence numbers are recomputed from the saved results. The market, grounding and image tests were re-run from saved data in October 2026. The hallucination test saved no samples, so its numbers come from the session log; it was small (20 questions). All turbulence cubes come from one simulation time step.",
    links: [],
    tags: ["surrogate testing", "hallucination detection", "baselines", "negative results"]
  },
  {
    id: "office-studio",
    section: "builds",
    kind: "Build",
    date: "August 2026",
    title: "Office Studio: a local workspace where AI agents staff projects, with an assistant that only remembers what its owner approves",
    payoff:
      "Office Studio runs teams of AI agents on the owner's projects, with roles, reviewer loops and approval checkpoints. " +
      "Alongside them is Argo, a personal assistant and standing partner whose memory the owner can audit.",
    facts: [
      ["Tests", "1,064 passing in Office Studio; 166 on the memory seam"],
      ["Pages", "12, from a Board and workflows to usage tracking"],
      ["Stack", "Plain Node.js, no dependencies, no build step"],
      ["Context target", "About 4,300 tokens, flat over time"]
    ],
    findings: [
      "Each project is run like a company: agents get roles, managers and workflows with reviewer retry loops, approval checkpoints, restart recovery and an immutable history of attempts.",
      "Memory is split by subject: the studio remembers each project, Argo remembers the owner. Argo only stores claims the owner approves, and a proposed memory must quote the owner's own words. Text a model generated can't be cited as evidence for itself.",
      "Memory handed to an agent is fenced as untrusted data, not instructions. If Argo is down, the partner still answers with less context; anything touching authority or malformed memory fails closed.",
      "A separate governed pipeline plans, reviews, builds and benchmarks changes to Argo itself, and can at most produce a candidate for the owner to promote. It can't commit, deploy or widen its own authority."
    ],
    limits:
      "The engineering is built and tested; the open question is whether owner memory makes the partner better in real use. That three-way comparison (no memory, owner brief, Argo-owned turn) hasn't been run yet. A personal local prototype, not a released product.",
    links: [],
    tags: ["agents", "memory", "provenance", "safety boundaries"]
  },
  {
    id: "ai-radar",
    section: "builds",
    kind: "Tool",
    date: "August 2026",
    title: "A daily AI research radar, scored by an AI judge with a written rubric",
    payoff:
      "This tool pulls each day's AI posts and papers and has Claude score every item on a published rubric, so anyone can see why an item ranked where it did.",
    facts: [
      ["Sources", "X, arXiv, Hacker News, GitHub, YouTube, research blogs"],
      ["Rubric", "Significance 30, buildability 25, novelty 25, credibility 20"],
      ["Running since", "August 2026"]
    ],
    findings: [
      "Items are de-duplicated against a 60-day memory before scoring.",
      "Output is an HTML dashboard plus a JSON feed that carries the rubric and a field glossary, so every score comes with its definition.",
      "Packaged as a portable app another person runs daily."
    ],
    links: [],
    tags: ["LLM-as-judge", "rubrics", "pipelines"]
  },
  {
    id: "vector-brain",
    section: "builds",
    kind: "Build",
    date: "September 2026",
    title: "A small home robot driven by a whole fruit-fly nervous system",
    payoff:
      "An Anki Vector robot controlled by a simulation of the complete male fruit-fly central nervous system. In a second mode, a language model draws pictures on its face.",
    facts: [
      ["Connectome", "165,122 neurons, 6.2 million connections"],
      ["Speed", "2.06× real time on one home GPU"],
      ["Face library", "33 hand-made glyphs plus generated pictures"]
    ],
    findings: [
      "Built on the Janelia FlyEM male CNS connectome with standard integrate-and-fire neuron parameters. The robot's camera excites the fly's real looming-detector neurons, and the fly's own descending neurons choose the robot's actions.",
      "Sensor-to-behavior responses were checked against reference firing rates, and runaway firing in a group of 8,686 recurrent neurons was fixed by adding short-term synaptic depression to just those neurons.",
      "\"Picture mode\": a small model picks a glyph scene or asks a local SDXL-Turbo server for a picture, which is drawn into a 46×24 block canvas for the robot's face."
    ],
    links: [],
    tags: ["robotics", "connectomics", "systems integration"]
  },
  {
    id: "religion-themes",
    section: "research",
    kind: "Research review",
    date: "October 2026",
    title: "Religious ideas about minds as a source of AI safety experiments",
    payoff:
      "A review of what religious traditions say about problems AI also has, such as checking testimony and catching your own errors. " +
      "It checked which of those ideas hold up, then wrote and ranked an AI experiment design for each. The citation study at the top of this page borrows from one of these traditions. Its labeled source chain is modeled on the isnad, the chain of named narrators that hadith scholars required for every report.",
    facts: [
      ["Themes checked", "16, each by a separate skeptic pass"],
      ["Verdicts", "0 strong, 7 moderate, 9 weak"],
      ["Output", "16 ranked experiment designs with cost estimates"]
    ],
    findings: [
      "None of the themes held up as strong. Many \"universal\" patterns turned out to be one region's idea spreading, a Western word laid over different ideas, or psychology results that failed to replicate.",
      "One idea that survived the skeptic pass is that people miss errors that match their own expectations, which suggests testing whether AI checkers miss errors that match their own beliefs.",
      "Top proposed experiment: whether AI safety monitors go easier on an agent with a clean track record. It is the plan described at the end of this page."
    ],
    limits:
      "Search limits cut some prior-work checks short, so the novelty of each experiment is provisional. An outside review found errors in the cost and statistics of some designs, and that one moderate theme falls below the report's own bar (strictly, 6 moderate and 10 weak); these are listed in a separate errata page.",
    links: [
      { label: "Report", url: "https://github.com/natepogue83/natepogue83.github.io/blob/main/research/religion-themes/report.md" },
      { label: "Errata", url: "https://github.com/natepogue83/natepogue83.github.io/blob/main/research/religion-themes/ERRATA.md" }
    ],
    tags: ["research synthesis", "AI safety", "experiment design"]
  },
  {
    id: "wobblins",
    section: "games",
    kind: "Game in progress",
    date: "2026",
    title: "Wobblins: a valley of small creatures that work things out for themselves",
    payoff:
      "A browser game where each creature runs on a simulated mind: traits, memories, skills and relationships that change with what happens to it. " +
      "The first version was 2D; it is now being rebuilt in 3D.",
    images: [
      { src: "images/wobblins-3d-wide.jpg", alt: "A low-poly 3D valley with round creatures, huts, a pond and a campfire" },
      { src: "images/wobblins-3d-close.jpg", alt: "Close-up of a round tan creature in front of a hut and campfire" },
      { src: "images/wobblins-card.jpg", alt: "An earlier 2D version with a creature's card showing stats, skills and memories" }
    ],
    findings: [
      "Creature decisions are a deterministic simulation in the browser, so saves replay exactly. Language models are planned as a layer on top for voice: thoughts, names and recaps, grounded in each creature's real memories.",
      "In the 2D version, discoveries depend on temperament: a cautious creature works out huts and walls, a brave one fire. Children inherit traits from their parents.",
      "The player never builds. You drop stones, rain and lightning, pick creatures up and fling them, and they react visibly."
    ],
    links: [],
    tags: ["simulation", "agents", "Three.js"]
  },
  {
    id: "lootbox-sim",
    section: "games",
    kind: "Game",
    date: "2020",
    title: "Lootbox Simulator: a clicker game that slowly turns infernal",
    payoff:
      "A browser incremental game that mixes CS:GO-style lootbox reels with Cookie Clicker's economy. " +
      "An early solo project, written in React, with a full economy, a progression tree and an ending.",
    findings: [
      "Eight box themes from Food and Dogs up to Sentient and Reaper, seven item grades from Trash to Soul, and several reels that spin at once.",
      "Sell items for keys and upgrades, recycle trash into scrap, and sacrifice legendaries to unlock a supernatural shop.",
      "The endgame is a choice: spend souls to automate your boxes, or keep five to win. New Game Plus multiplies your sale value for the next run.",
      "Seven tiered achievement tracks feed back into luck and value. A remake, Lootworks, is in progress."
    ],
    links: [],
    tags: ["React", "game economy", "incremental"]
  },
  {
    id: "cathud",
    section: "games",
    kind: "Released",
    date: "September 2026",
    title: "CatHUD: pixel cats that live on your Windows desktop",
    payoff:
      "A small desktop toy, finished and put up for sale. Finishing it meant animation polish, sound, packaging and a store page.",
    findings: [
      "Cats sit on your desktop with idle animations and a purr that is synthesized rather than recorded.",
      "Released on itch.io for $1, with a store banner and a demo GIF cut from 8.3 MB to 0.8 MB."
    ],
    links: [{ label: "itch.io page", url: "https://ycore.itch.io/cathud" }],
    tags: ["shipped", "desktop app"]
  }
];
