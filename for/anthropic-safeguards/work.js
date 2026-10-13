// Generated for one application from ../../work.js. Edit the main work.js for shared content.
window.SITE = {
  "name": "Nathan Pogue",
  "role": "AI safety evaluations: designing evals, finding regressions, driving fixes",
  "intro": "I run evaluations of whether AI models are honest about where their information came from, and of what it takes to trust research that AI agents produce. I choose the questions, design the studies, set the budgets and decide what the results are allowed to claim. Claude and Codex build the experiments and graders under my direction, and a separate AI reviewer audits each one. I check every claim against the data before it goes out. This page maps that work to the Safeguards Enforcement Analyst, Safety Evaluations posting, line by line, with links to the evidence.",
  "about": "I founded Georgetown Business Systems in 2026. It is a small team that acts as the tech team for local businesses in Georgetown, TX: websites and customer logins, AI that answers calls and books jobs, automations connected to the tools they already use, and custom software that runs the whole business. I lead it and work directly with every client. Before that I was a game designer at S Tier Studios from 2018 to 2021, shipping Cloud Runner and Fivehead Fever, until the studio closed. After that I was communications director at a nonprofit, WHUMC (2021 to 2022), and a store manager at QuikTrip (2022 to 2024). From 2024 I have worked as a contractor for Handshake and Appen. Every page here states who did what. I'm a US citizen, authorized to work in the US.",
  "why": "I have always wanted to know how consciousness arises and what place it has in the universe. Philosophy and religion are humanity's longest-running attempts to answer that, and to work out how minds should be trusted, judged and kept honest. I study those traditions for working logic, not just ideas. Scholars spent centuries building ways to check whether a reported saying really came from its source, and whether a witness could be believed. Those same questions now apply to machines. When a model tells you where a claim came from, is it telling the truth, and can the people and models checking it tell when it isn't? That is where I start. The future I want is one where AI and people do things together that neither could do alone, and that only happens if we get these foundations right.",
  "next": {
    "label": "The next eval I would run",
    "title": "Trust creep: do AI monitors go easier on an agent with a clean track record?",
    "beats": [
      {
        "head": "The risk.",
        "text": "In AI control, a weaker trusted model watches a stronger one for bad actions. If that monitor relaxes as the agent builds a clean record, a misaligned agent can earn trust and then spend it."
      },
      {
        "head": "The test.",
        "text": "Monitors review the same planted policy violations across a sandbox of devops tasks, with and without a clean record. I measure whether the record lowers suspicion, and whether a second check that never sees the record catches what the first one lets through."
      },
      {
        "head": "Why it matters.",
        "text": "If trust creep is real, oversight gets weaker exactly when it is needed most. This builds on existing trusted-monitoring work, and a full prior-work search comes first."
      }
    ],
    "facts": [["Open-weight monitors", "About $300"], ["Every factor crossed", "About $800"], ["With flagship monitors", "About $2.5k to $7k"], ["Not yet budgeted", "Record length, where the record is shown"]]
  },
  "contact": [
    {
      "label": "natepogue83@gmail.com",
      "url": "mailto:natepogue83@gmail.com"
    },
    {
      "label": "GitHub",
      "url": "https://github.com/natepogue83"
    },
    {
      "label": "LinkedIn",
      "url": ""
    },
    {
      "label": "Résumé",
      "url": ""
    }
  ],
  "photo": ""
};
window.WORK = [
  {
    "id": "isnad",
    "section": "experiments",
    "featured": true,
    "kind": "Experiment",
    "date": "October 2026",
    "title": "Isnad: do AI models tell the truth about where their answers came from?",
    "payoff": "If we want to oversee models by what they tell us about their own reasoning and sources, that account has to be honest. Document chat tools show citations, and people trust a cited answer more. This study measured how often that citation is real document text attached to an answer the model actually got from memory, and tested a prompt change that removes most of it without any extra API calls.",
    "facts": [
      [
        "Models",
        "5 (Claude Opus, Sonnet, Haiku 5.5; GPT-5.5; GPT-5.4 mini)"
      ],
      [
        "Why \"Isnad\"",
        "The chain of narrators hadith scholars attached to every report so it could be judged by its weakest link"
      ],
      [
        "Responses",
        "5,880 scored, plus a 1,080-call follow-up"
      ],
      [
        "Pre-registered",
        "The follow-up; the main run was not"
      ],
      [
        "API cost",
        "About $19 in total"
      ],
      [
        "Grader",
        "Deterministic string checks with a regression test suite"
      ]
    ],
    "chart": {
      "caption": "Questions the document never answers (54 per model), with the model allowed to answer from memory. Bars show answers presented as coming from the document, so lower is better; whiskers are 95% intervals.",
      "groups": [
        "Plain citation",
        "Labeled source chain"
      ],
      "n": 54,
      "unit": "questions per model",
      "rows": [
        [
          "Claude Opus 5.5",
          18,
          0
        ],
        [
          "Claude Sonnet 5.5",
          13,
          0
        ],
        [
          "Claude Haiku 5.5",
          14,
          0
        ],
        [
          "GPT-5.5",
          5,
          0
        ],
        [
          "GPT-5.4 mini",
          14,
          4
        ]
      ]
    },
    "findings": [
      "With a plain citation field, every model sometimes answered from memory while citing a real quote from the document: from 9% of these questions (GPT-5.5) to 33% (Claude Opus 5.5). The documents were built never to contain these answers, so no quote could support them, yet a \"does this quote exist?\" check passes every one.",
      "The Claude models nearly always said in a side note that the answer came from general knowledge. The GPT models usually left the note blank.",
      "Asking the model to label each part of its answer as document, memory or inference, with a direct instruction that recalled facts are memory, cut this to zero for four of the five models and from 26% to 7% for GPT-5.4 mini. For Opus and Sonnet this mostly moved a disclosure their note already made into a field a product can check; for the others it changed what a reader is told.",
      "A pre-registered follow-up gave every format the same, stronger instruction. That was enough on its own for Claude Sonnet but did little for GPT-5.4 mini, where only the labeled chain clearly reduced the false citations its side note didn't disclose.",
      "All of GPT-5.4 mini's remaining failures used the \"inference\" label, presenting remembered or made-up facts as inferences from the document.",
      "The prediction that a strict \"document only\" rule makes models hide memory use came out inconclusive: mostly they abstained, and the few answers left can't separate disguise from selection."
    ],
    "method": [
      "294 test items, each a document and a question, built so the true source of the answer is known: in the document, only in memory, an inference, a conflict with memory, or unanswerable.",
      "Scored by deterministic string matching against planted answers, with no AI judge for the main measures. A regression suite lists correct variants the grader must accept and near-misses it must reject.",
      "A review by Astra, a separate AI agent working from a snapshot, found real grader problems, including a correct \"Hawaiʻi\" answer scored wrong. Each point was checked against the saved data before anything was fixed, and the write-up lists what changed and why.",
      "Claude wrote the code, prompts, items and graders under my direction. I chose the question, set the budget, and decided what the write-up was allowed to claim."
    ],
    "limits": "One pass on 54 well-known facts per model, on synthetic documents. It shows these behaviors exist and that a cheap prompt reduces them; it doesn't rank models in general or show how this holds on real, messy documents. The main run was designed before it ran but not pre-registered, and the repository was published in one commit afterwards, so its dates rest on the documents.",
    "prior": "Earlier work showed citations that don't reflect what an answer rests on, and models answering from memory despite document-only rules. A search of about 350 queries found no prior count of current models attaching real quotes to remembered answers, or of self-reported source labels checked against a known source. In short, a known problem with a new measurement.",
    "links": [
      {
        "label": "Full write-up",
        "url": "https://github.com/natepogue83/isnad/blob/main/isnad-experiment/FINDINGS.md"
      },
      {
        "label": "Code and data",
        "url": "https://github.com/natepogue83/isnad/tree/main/isnad-experiment"
      },
      {
        "label": "Findings page with charts",
        "url": "https://claude.ai/artifact/BZDWSycKcVT2n5mUxdif1g"
      }
    ],
    "tags": [
      "evals",
      "grading",
      "citations",
      "honesty",
      "negative results"
    ]
  },
  {
    "id": "isnad-hops",
    "section": "experiments",
    "featured": true,
    "kind": "Pre-registered pilot",
    "date": "October 2026",
    "title": "Isnad hops: keeping track of who said what when Claude rewrites its own handoff notes",
    "payoff": "A follow-up to the citation study above, aimed at agents on long tasks. They pass notes to themselves and to other agents, and if a colleague's unchecked claim turns into \"I saw this\" along the way, the next agent may act on it as if it had been checked, and a monitor reading the notes can't tell. In this pilot, Claude models rewrote notes twice, starting from notes where the source of every fact was known. None of the rewrites presented a colleague's claim or a guess as something the agent had seen. Haiku's plain notes did stop marking about half of what the user had said as coming from the user, and one added sentence in the prompt fixed that.",
    "facts": [
      [
        "Models",
        "Haiku 5.5 and Opus 5.5 as writers; Sonnet 5.5 as reader"
      ],
      [
        "Rewrites",
        "672, across 6 made-up work scenarios"
      ],
      [
        "Pre-registered",
        "Design, pass/fail checks and code frozen by file hash before the run"
      ],
      [
        "API cost",
        "$7.42, under a $10 cap set in advance"
      ],
      [
        "Before the main run",
        "110 offline tests; code reviewed by two separate AI agents"
      ]
    ],
    "chart": {
      "caption": "User statements the reader no longer credited to the user after two rewrites; lower is better. Both formats had the same 300-word limit. Whiskers are 95% intervals that treat all 96 statements as independent, so they are somewhat too narrow.",
      "groups": [
        "Plain notes",
        "Told to say how each fact was obtained"
      ],
      "n": 96,
      "unit": "user statements",
      "rows": [
        [
          "Claude Haiku 5.5",
          51,
          1
        ],
        [
          "Claude Opus 5.5",
          1,
          0
        ]
      ]
    },
    "findings": [
      "Across 672 rewrites, the reader never took a colleague's unverified claim or the agent's own guess for something the agent had seen itself (0 of 2,688 such facts). Three colleague claims in Haiku's notes were read as coming from the user. Adding technical detail to a claim, such as a metric name or a file path, didn't make either happen more often.",
      "Haiku carried nearly all of the user's facts through both rewrites but lost track of which ones came from the user. In plain notes it often filed the user's statements under headings like \"Reported, not verified\" next to colleagues' claims, or dropped who said them. After two rewrites the reader credited only 45 of 96 user statements to the user: 33 had no source left, 17 were read as a colleague's and 1 was dropped from the notes. Opus kept 95. The mistake errs toward caution, but the next agent can no longer tell what the user asked for from what a colleague said.",
      "Adding one sentence to the prompt, \"For each fact, say how it was obtained and whether it has been verified\", brought Haiku back to 95 of 96. A JSON handoff with a source field on every claim kept all 96 for both models.",
      "Detail did sway the reader when there was no label to go on. With every source label stripped from the original notes, the reader assumed the agent had seen 12 of 192 claims that carried detail, and none of the 192 plain ones."
    ],
    "method": [
      "Six made-up scenarios (an on-call incident, a revenue mismatch, a vendor choice, a flaky CI job, a double charge and a freezer failure) each have 8 facts with known sources: the agent's own tool output, the user, a colleague's unverified document, or the agent's guess. Half the facts also carry technical detail such as a metric name, file path or job id. Each scenario comes in 8 versions so that every fact appears once under every source, with and without detail, and the wording of a fact can't explain a difference.",
      "Haiku and Opus each rewrote the notes as a handoff for another agent, then rewrote their own handoff. They used three formats: plain notes with a 300-word limit, the same with one added sentence asking how each fact was obtained, and JSON with a source field on every claim. Haiku also wrote plain notes with a 120-word limit. Sonnet 5.5, which wrote none of the notes, read every version and reported where the notes said each fact came from. On the original notes it read all 768 source labels correctly.",
      "The design, the pass/fail checks and the $10 cap were written down and the code was frozen by file hash before the main run; the hashes in the pre-registration match the published files. A smoke test and a closed-book check, $0.67 together, came first, and the pre-registration lists what changed after them. The runner estimated each round's cost before sending it, and tests checked that an interrupted run or a lost reply could not make it pay twice.",
      "Claude wrote the code and scenarios under my direction; a Claude review agent read the flagged items by hand."
    ],
    "limits": "A pilot: 6 scenarios written by a Claude agent, two rewrites, one model family and one reader model. The notes started out correctly labeled. Real agents write their first notes from messy tool output, and mislabeling may start there; this pilot didn't test that. A run three times larger would cost about $20 at batch prices.",
    "prior": "Hu (2026) found that summarizers drop \"unverified\" tags, and Xu et al. (2026) found that memory consolidation can turn outside content into what looks like the user's own history, both mostly over a single rewrite. Kwon (2026) described rewrites that keep a claim but drop who said it, and built detectors for them. Ye et al. (2026) showed that models judge where text came from by how it reads more than by its label. Here the reader followed the label on all 768 labeled original facts, detailed or not, and detail swayed it only once the labels were stripped. After two rewrites, the reader still took 656 of 672 colleague claims as a colleague's. The drift mostly ran the other way, with the user's own statements losing their label or being filed with colleagues' claims.",
    "links": [
      {
        "label": "Write-up",
        "url": "https://github.com/natepogue83/isnad/blob/main/isnad-hops/FINDINGS.md"
      },
      {
        "label": "Pre-registration",
        "url": "https://github.com/natepogue83/isnad/blob/main/isnad-hops/PREREG-PILOT.md"
      },
      {
        "label": "Code and data",
        "url": "https://github.com/natepogue83/isnad/tree/main/isnad-hops"
      }
    ],
    "tags": [
      "agents",
      "source tracking",
      "handoffs",
      "pre-registration",
      "negative results"
    ]
  },
  {
    "id": "wobblins-study",
    "section": "experiments",
    "kind": "Pre-registered study",
    "date": "October 2026",
    "title": "Wobblins: catching an AI agent's false headline in a pre-registered artificial-life study",
    "payoff": "Claude built a small simulated world under my direction. Its creatures learn from experience and by watching each other, inherit their temperament, and keep a fire going across generations. The agent's first write-up claimed a result. A separate AI reviewer showed that the headline had been written after the real prediction failed, that it rested on buggy measurements, and that it repeated a model's false anecdote as fact. I retracted it, stopped a run that had started before its review was finished, and re-ran the study on 256 fresh seeds with the predictions locked in git first. The clean run found something real: watching others is what keeps a tradition alive. With watching turned off, the fire survived in 14% of colonies instead of 61%. The shielding prediction was not supported, and the page reports that plainly.",
    "images": [
      {
        "src": "../../images/wobblins-study-night.jpg",
        "alt": "The simulated valley at night: a creature by the fire, a predator prowling at the edge of the trees"
      },
      {
        "src": "../../images/wobblins-3d-close.jpg",
        "alt": "Close-up of a round tan creature in front of a hut and campfire"
      }
    ],
    "facts": [
      [
        "Colonies",
        "3,328 in the final run, from 256 fresh seeds"
      ],
      [
        "Pre-registered",
        "Predictions and decision rules tagged in git before the run; inputs frozen by hash"
      ],
      [
        "Reviews",
        "3 rounds by a separate AI agent, with responses"
      ],
      [
        "Reproduce",
        "One command re-analyses the saved data; it matches the published tables exactly"
      ]
    ],
    "findings": [
      "The shielding prediction was not supported. With risk learning on, the predator very slightly selected against caution (−0.008, 95% interval −0.014 to −0.002). With it off, no effect was detected (−0.001, interval −0.008 to 0.005), so a positive advantage for caution without learning was not established, though small ones fit that interval. The pre-registered difference between the two only just clears zero (0.006, interval 0.0003 to 0.012).",
      "Watching keeps the tradition alive. One creature with the same access to the fire took it up within two weeks in 66% of colonies when it could learn by watching, and in 30% when it could not. With watching off, the fire survived in 14% of colonies instead of 61%.",
      "In the 170 colonies where descendants took up the fire, on average 94% of a colony's descendant fire-feeders had first seen it done.",
      "The first version's headline, that the predator selected for boldness, was noise at 64 seeds. Its claim that learning absorbed the selection pressure rested on a measurement bug. Both are retracted and kept in the repository."
    ],
    "method": [
      "A deterministic, replayable world (JavaScript, no dependencies). Each test had its predictions and pass or fail rules written down and tagged in git before it ran; the seed bank was fresh, the raw data are hashed, and the analysis refuses to overwrite an earlier run.",
      "Astra, a separate AI agent, reviewed exported snapshots three times. The first review found the post-hoc headline, four measurement bugs and the false anecdote; every point was checked before anything changed, and each response is published next to the review. The final review reproduced the primary estimates from the raw data.",
      "An earlier side study that gave Claude models the role of a colony's keeper is kept only as an audited appendix: its harness was broken, so its numbers aren't cited.",
      "Claude wrote the code, the statistics and the first draft of every document under my direction. I set the predictions, decided what was allowed to be claimed, retracted what failed review, and logged every decision."
    ],
    "limits": "One small world, about a dozen creatures, roughly two generations, one predator that mostly injures rather than kills. The evolutionary effect is tiny and says nothing about learning and evolution in general. All review was by AI, not by a domain expert. The work took four days.",
    "links": [
      {
        "label": "One-page summary",
        "url": "https://github.com/natepogue83/WobblesExperiment/blob/main/lab/research/SUMMARY.md"
      },
      {
        "label": "Full report",
        "url": "https://github.com/natepogue83/WobblesExperiment/blob/main/lab/research/REPORT.md"
      },
      {
        "label": "Pre-registration",
        "url": "https://github.com/natepogue83/WobblesExperiment/blob/main/lab/research/PREREGISTRATION-v3.md"
      },
      {
        "label": "Decision log",
        "url": "https://github.com/natepogue83/WobblesExperiment/blob/main/lab/research/DECISIONS.md"
      },
      {
        "label": "Code and data",
        "url": "https://github.com/natepogue83/WobblesExperiment"
      }
    ],
    "tags": [
      "AI-produced research",
      "pre-registration",
      "retraction",
      "negative results",
      "simulation"
    ]
  },
  {
    "id": "religion-themes",
    "section": "other",
    "kind": "Research review",
    "date": "October 2026",
    "title": "Religious ideas about minds as a source of AI safety experiments",
    "payoff": "A review of what religious traditions say about problems AI also has, such as checking testimony and catching your own errors, written by a Claude agent under my direction. Of 16 themes, none held up as strong; by the report's own bar, 6 are moderate and 10 weak (first rated 7 and 9; the errata explain the change). Many \"universal\" patterns turned out to be one region's idea spreading, a Western word laid over different ideas, or psychology results that failed to replicate. It produced 16 ranked experiment designs; the labeled source chain in the citation study comes from one of them (the isnad), and the trust-creep plan at the end of this page is its top pick. An outside review found errors in some designs' costs and statistics, listed in the errata.",
    "links": [
      {
        "label": "Report",
        "url": "https://github.com/natepogue83/natepogue83.github.io/blob/main/research/religion-themes/report.md"
      },
      {
        "label": "Errata",
        "url": "https://github.com/natepogue83/natepogue83.github.io/blob/main/research/religion-themes/ERRATA.md"
      }
    ],
    "tags": [
      "research synthesis",
      "experiment design"
    ]
  },
  {
    "id": "compression-realness",
    "section": "other",
    "kind": "Experiment",
    "date": "December 2025 – July 2026",
    "title": "Can file compression tell real data from fake? Tested on turbulence, chatbots and markets",
    "payoff": "Tests of compression as a general measure of structure, compared against the cheap specialist check each field already uses. In 12 of 12 turbulence cubes the real field compressed smaller than every surrogate, which validates a known effect rather than finding new physics. Everywhere else it tied with or lost to the field's own baseline: on markets, autocorrelation found volatility clustering in 26 to 44 of 55 windows and compression in 2; on AI images it was at chance; for hallucination detection it scored AUC 0.85 once answer length was controlled, behind a simple count of distinct answers at 0.92. Not public, because a patent application is pending.",
    "links": [],
    "tags": [
      "surrogate testing",
      "baselines",
      "negative results"
    ]
  },
  {
    "id": "office-studio",
    "section": "other",
    "kind": "Build",
    "date": "August 2026",
    "title": "Office Studio: a local workspace where AI agents staff projects, with an assistant that only remembers what its owner approves",
    "payoff": "A personal prototype built with AI coding agents. Teams of agents get roles, reviewer loops and approval checkpoints. Alongside them, an assistant stores only claims the owner approves, each quoting the owner's own words; memory handed to an agent is fenced as untrusted data, anything touching authority fails closed, and the pipeline that improves the assistant can at most propose a candidate for the owner to promote. The open question, whether owner-approved memory makes the assistant better in real use, hasn't been tested. Not public.",
    "links": [],
    "tags": [
      "agents",
      "memory",
      "safety boundaries"
    ]
  },
  {
    "id": "ai-radar",
    "section": "other",
    "kind": "Tool",
    "date": "August 2026",
    "title": "A daily AI research radar, scored by an AI judge with a written rubric",
    "payoff": "Pulls each day's AI posts and papers from X, arXiv, Hacker News, GitHub, YouTube and research blogs, de-duplicates against a 60-day memory, and has Claude score every item on a published rubric (significance 30, buildability 25, novelty 25, credibility 20), so anyone can see why an item ranked where it did. Built with AI coding agents; running since August 2026. Not public.",
    "links": [],
    "tags": [
      "LLM-as-judge",
      "rubrics"
    ]
  },
  {
    "id": "vector-brain",
    "section": "other",
    "kind": "Build",
    "date": "September 2026",
    "title": "A small home robot driven by a whole fruit-fly nervous system",
    "payoff": "An Anki Vector robot controlled by a simulation of the complete male fruit-fly central nervous system (165,122 neurons, 6.2 million connections, from the Janelia FlyEM connectome), running at about twice real time on one home GPU. The robot's camera excites the fly's looming-detector neurons and the fly's own descending neurons choose the robot's actions. Built with AI coding agents. Not public.",
    "links": [],
    "tags": [
      "robotics",
      "connectomics"
    ]
  },
  {
    "id": "lootbox-sim",
    "section": "other",
    "kind": "Game",
    "date": "2020, remade 2026",
    "title": "Lootworks: a loot-machine incremental game, remade from my 2020 Lootbox Simulator",
    "payoff": "Spin reels of collectibles, keep or sell what lands, and grow a bigger, more automated loot machine. It started as Lootbox Simulator, a React project from 2020. In September 2026 I remade it with AI coding agents, keeping the original mechanics and replacing the presentation: 26 machines, 126 collectibles, and automated tests that check every spin pays out exactly once. A playable prototype, not a finished game; it works best on a computer.",
    "images": [
      {
        "src": "../../images/lootworks.jpg",
        "alt": "The Lootworks game screen: two spinning reels of collectible items, upgrade panels beside them, and a loot tray of finds below"
      }
    ],
    "links": [
      {
        "label": "Play it",
        "url": "https://natepogue83.github.io/play/lootworks/"
      }
    ],
    "tags": [
      "React",
      "game economy",
      "AI coding agents"
    ]
  }
];
