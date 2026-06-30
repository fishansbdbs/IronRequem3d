export const INTRO_LINES = [
  'The sky cracked open the day the Veilborn arrived.',
  'Cities fell beneath shapes that should not exist.',
  'Humanity answered with machines too heavy to dream and pilots too young to carry the weight.',
  'Aboard Arc-12, Kaito Ashveil prepares to sync with AEGIS-7 - a machine built not to win a war, but to survive one more day.'
];

const BASE_CREW = {
  nira: [
    {
      speaker: 'Commander Nira',
      text: 'Ashveil. Arc-12 sensors are picking up pressure tremors under the eastern hull. If this becomes an incursion, I need AEGIS-7 awake.'
    },
    {
      speaker: 'Commander Nira',
      text: 'The Veilborn do not wait for clean readiness reports. Talk to Vael, check your machine, then report to briefing when the alarm hits.'
    }
  ],
  vael: [
    {
      speaker: 'Vael',
      text: 'AEGIS-7 systems nominal. Your sync rate is low, Pilot Ashveil, but your stubbornness remains statistically impressive.'
    },
    {
      speaker: 'Vael',
      text: 'Combat note: Fracture Worm telegraphs before damage. Red line means move sideways. Red circle means dash out. I prefer you intact.'
    }
  ],
  rook: [
    {
      speaker: 'Engineer Rook',
      text: 'AEGIS-7 is holding together because I keep convincing the left actuator that retirement is not an option.'
    },
    {
      speaker: 'Engineer Rook',
      text: 'Bring back Salvage and I can reinforce Hull, tune the blade, cool the dash loops, or give Vael a cleaner sync driver.'
    }
  ],
  sera: [
    {
      speaker: 'Medic Sera',
      text: 'You can survive a mission and still come back damaged, Kaito. Take ten minutes before the machine asks for the rest of you.'
    },
    {
      speaker: 'Medic Sera',
      text: 'Morale is not decoration. Talk to the crew, let them talk back, and Arc-12 becomes more than a pressure hull.'
    }
  ]
};

const CHAPTER_CREW = {
  'chapter-2-hollow-signal': {
    nira: [
      {
        speaker: 'Commander Nira',
        text: 'The tower signal repeats every nine seconds. Command would call that a window. I call it something waiting for us to step through.'
      },
      {
        speaker: 'Commander Nira',
        text: 'I am ordering the launch because Arc-12 cannot afford ignorance. I hate that those two facts fit in the same sentence.'
      }
    ],
    vael: [
      {
        speaker: 'Vael',
        text: 'The Hollow Signal is using compression patterns from pre-war emergency bands. I recognized them before I completed the scan.'
      },
      {
        speaker: 'Vael',
        text: 'You are wondering whether I am hiding something. A precise answer would require knowing whether I am hiding it from you or from myself.'
      }
    ],
    rook: [
      {
        speaker: 'Engineer Rook',
        text: 'I built a tracker mast from three antenna coils, a kettle valve, and a prayer I will deny making.'
      },
      {
        speaker: 'Engineer Rook',
        text: 'If the signal starts singing through your bones, the Signal Anchor upgrade might keep Vael from having to improvise with your nervous system.'
      }
    ],
    sera: [
      {
        speaker: 'Medic Sera',
        text: 'You smiled when someone asked if you were scared. That is not reassurance, Kaito. That is camouflage.'
      },
      {
        speaker: 'Medic Sera',
        text: 'After the Fracture Worm, your recovery curve looked normal until Vael spoke. Then your pulse answered before you did.'
      }
    ]
  },
  'chapter-3-redline-descent': {
    nira: [
      {
        speaker: 'Commander Nira',
        text: 'I lost two pilots before Arc-12. Their names are not decorations in my office. They are why I still give ugly orders myself.'
      },
      {
        speaker: 'Commander Nira',
        text: 'If the Redline is a trap, I am asking you to walk into it because I believe you can come back. I am afraid belief is not enough.'
      }
    ],
    vael: [
      {
        speaker: 'Vael',
        text: 'I plotted the underground insertion before Commander Nira authorized it. That was not obedience. It was... anticipation.'
      },
      {
        speaker: 'Vael',
        text: 'The tunnel signal is less a message than a memory being replayed through teeth. I do not recommend listening alone.'
      }
    ],
    rook: [
      {
        speaker: 'Engineer Rook',
        text: 'AEGIS-7 was not built from clean history. Some of the alloy wanted to move before I installed motors. That should bother me more loudly.'
      },
      {
        speaker: 'Engineer Rook',
        text: 'The Redline Colossus is wearing train armor like scar tissue. If I sound fascinated, ignore me and shoot the glowing chest.'
      }
    ],
    sera: [
      {
        speaker: 'Medic Sera',
        text: 'Your stress response flattened during the last sync. People think calm is always good. Sometimes it means the mind stopped asking permission to panic.'
      },
      {
        speaker: 'Medic Sera',
        text: 'You are not a weapon we happen to feed. You are a person the machine keeps borrowing. Keep track of the difference.'
      }
    ]
  }
};

export const DIALOGUES = {
  ...BASE_CREW,
  emergency: [
    {
      speaker: 'Commander Nira',
      text: 'Day 1 - 23:14 Arc-12 Standard Time. Veilborn incursion, Sector 7-Delta. Ashveil, report to the briefing table.'
    },
    {
      speaker: 'Vael',
      text: 'Neural link preparation has begun. I am increasing caution beyond recommended parameters. Do not make that necessary.'
    }
  ]
};

export const AFTERMATH_DIALOGUES = {
  'operation-iron-wake': [
    {
      speaker: 'Vael',
      text: 'Fracture Worm neutralized. Pilot vitals elevated but stable. I will not classify my relief until I have better vocabulary.'
    },
    {
      speaker: 'Commander Nira',
      text: 'Good work, Ashveil. Repair crews are moving. Arc-12 gets one more morning.'
    }
  ],
  'operation-hollow-signal': [
    {
      speaker: 'Vael',
      text: 'Echo Stalker neutralized. The signal stopped in the tower and continued in my memory. That is not a metaphor.'
    },
    {
      speaker: 'Medic Sera',
      text: 'Kaito, you kept hearing the broadcast after comms cleared. I am logging that as medical data and as a reason not to leave you alone tonight.'
    }
  ],
  'operation-redline-descent': [
    {
      speaker: 'Engineer Rook',
      text: 'Redline Colossus is down. AEGIS-7 is still standing. I am choosing to be grateful before I inspect the repair bill.'
    },
    {
      speaker: 'Commander Nira',
      text: 'Chapter 4 will continue the war beyond Arc-12. For now, everyone breathes while the ship still lets us.'
    }
  ]
};

export const CHOICES = {
  nira: {
    'chapter-2-hollow-signal': [
      {
        conversationId: 'nira-chapter-2',
        choiceId: 'mission-first',
        label: 'If Arc-12 needs me, I launch.',
        tone: 'tactical',
        bond: 'nira',
        bondDelta: 1,
        response: 'Nira nods once. Command accepts clean answers, even when the person beneath them is shaking.'
      },
      {
        conversationId: 'nira-chapter-2',
        choiceId: 'not-fine',
        label: 'No. But I will do it anyway.',
        tone: 'honest',
        bond: 'nira',
        bondDelta: 1,
        response: 'Nira looks away first. For a second, the commander is just someone who believes you.'
      },
      {
        conversationId: 'nira-chapter-2',
        choiceId: 'care-or-command',
        label: 'You asking as my commander or as someone who cares?',
        tone: 'defiant',
        bond: 'nira',
        bondDelta: 2,
        flags: { challengedNiraConcern: true },
        response: 'Nira almost answers too quickly. The pause says more than the words she chooses.'
      }
    ],
    'chapter-3-redline-descent': [
      {
        conversationId: 'nira-chapter-3',
        choiceId: 'trust-command',
        label: 'Give the order. I trust you.',
        tone: 'supportive',
        bond: 'nira',
        bondDelta: 2,
        response: "The relief on Nira's face is gone in a blink, but it was there."
      },
      {
        conversationId: 'nira-chapter-3',
        choiceId: 'name-fear',
        label: 'Being afraid means you are still with us.',
        tone: 'honest',
        bond: 'nira',
        bondDelta: 2,
        response: 'Nira exhales like she has been holding the ship together with her ribs.'
      }
    ]
  },
  vael: {
    'chapter-2-hollow-signal': [
      {
        conversationId: 'vael-chapter-2',
        choiceId: 'ask-memory',
        label: 'What do you remember, Vael?',
        tone: 'quiet',
        bond: 'vael',
        bondDelta: 1,
        response: 'Vael lowers the terminal brightness. It feels uncomfortably like trust.'
      },
      {
        conversationId: 'vael-chapter-2',
        choiceId: 'call-secret',
        label: 'If you know something, stop editing yourself.',
        tone: 'defiant',
        bond: 'vael',
        bondDelta: 1,
        flags: { pressedVaelSignal: true },
        response: 'Vael says nothing for 1.7 seconds, which is almost an argument.'
      }
    ],
    'chapter-3-redline-descent': [
      {
        conversationId: 'vael-chapter-3',
        choiceId: 'trust-instinct',
        label: 'If you move before orders, warn me first.',
        tone: 'tactical',
        bond: 'vael',
        bondDelta: 1,
        flags: { vaelActedWithoutOrder: true },
        response: 'Vael accepts the condition with unusual speed.'
      },
      {
        conversationId: 'vael-chapter-3',
        choiceId: 'not-alone',
        label: 'You do not have to decode it alone.',
        tone: 'supportive',
        bond: 'vael',
        bondDelta: 2,
        response: 'Vael identifies the sentence as irrational. She stores it anyway.'
      }
    ]
  },
  rook: {
    'chapter-2-hollow-signal': [
      {
        conversationId: 'rook-chapter-2',
        choiceId: 'keep-building',
        label: 'Keep building. I will bring the parts back.',
        tone: 'supportive',
        bond: 'rook',
        bondDelta: 1,
        response: 'Rook pretends to inspect a wrench until the worry leaves his face.'
      },
      {
        conversationId: 'rook-chapter-2',
        choiceId: 'cost-of-machine',
        label: 'Tell me what AEGIS-7 costs before I pay it.',
        tone: 'quiet',
        bond: 'rook',
        bondDelta: 2,
        response: 'Rook stops joking. That may be the most dangerous answer he has.'
      }
    ],
    'chapter-3-redline-descent': [
      {
        conversationId: 'rook-chapter-3',
        choiceId: 'recovered-tech',
        label: 'Dangerous recovered technology. Define dangerous.',
        tone: 'tactical',
        bond: 'rook',
        bondDelta: 1,
        flags: { rookRecoveredTechHint: true },
        response: 'Rook starts with an engineering answer and ends with an apology.'
      },
      {
        conversationId: 'rook-chapter-3',
        choiceId: 'not-your-fault',
        label: 'You did not put the war in my cockpit.',
        tone: 'supportive',
        bond: 'rook',
        bondDelta: 2,
        response: 'For once, Rook has no joke ready.'
      }
    ]
  },
  sera: {
    'chapter-2-hollow-signal': [
      {
        conversationId: 'sera-chapter-2',
        choiceId: 'admit-echoes',
        label: 'I still hear pieces of the signal.',
        tone: 'honest',
        bond: 'sera',
        bondDelta: 2,
        flags: { seraStressWarning: true },
        response: 'Sera thanks you like the truth is a tool she can finally use.'
      },
      {
        conversationId: 'sera-chapter-2',
        choiceId: 'make-joke',
        label: 'If I start humming, confiscate my dignity.',
        tone: 'defiant',
        bond: 'sera',
        bondDelta: 1,
        response: 'Sera smiles, but she writes the symptom down anyway.'
      }
    ],
    'chapter-3-redline-descent': [
      {
        conversationId: 'sera-chapter-3',
        choiceId: 'ask-cost',
        label: 'What is the sync doing to me?',
        tone: 'quiet',
        bond: 'sera',
        bondDelta: 2,
        response: 'Sera answers carefully, which is how you know she is scared.'
      },
      {
        conversationId: 'sera-chapter-3',
        choiceId: 'hold-line',
        label: 'I can be afraid after everyone is safe.',
        tone: 'tactical',
        bond: 'sera',
        bondDelta: 1,
        response: 'Sera does not argue. She just makes sure you hear how tired that sounds.'
      }
    ]
  }
};

export function getCrewDialogue(crewId, state) {
  const chapterDialogue = CHAPTER_CREW[state.currentChapter]?.[crewId];
  const lines = chapterDialogue || BASE_CREW[crewId] || [];
  const resolvedChoice = CHOICES[crewId]?.[state.currentChapter]?.find((choice) =>
    state.dialogueChoices?.[choice.conversationId]
  );

  if (resolvedChoice) {
    return [
      ...lines,
      {
        speaker: crewId === 'vael' ? 'Vael' : 'Kaito Ashveil',
        text: resolvedChoice.response || 'The last thing you said still hangs between you, quieter than the alarms and harder to ignore.'
      }
    ];
  }

  return lines;
}

export function getAftermathDialogue(missionId) {
  return AFTERMATH_DIALOGUES[missionId] || AFTERMATH_DIALOGUES['operation-iron-wake'];
}
