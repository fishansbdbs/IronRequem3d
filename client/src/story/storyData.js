export const INTRO_LINES = [
  'The sky cracked open the day the Veilborn arrived.',
  'Cities fell beneath shapes that should not exist.',
  'Humanity answered with machines too heavy to dream and pilots too young to carry the weight.',
  'Aboard Arc-12, Kaito Ashveil prepares to sync with AEGIS-7 - a machine built not to win a war, but to survive one more day.'
];

const BASE_CREW = {
  nira: [
    { speaker: 'Commander Nira', text: 'Ashveil. Arc-12 sensors are picking up pressure tremors under the eastern hull. If this becomes an incursion, I need AEGIS-7 awake.' },
    { speaker: 'Commander Nira', text: 'The Veilborn do not wait for clean readiness reports. Talk to Vael, check your machine, then report to briefing when the alarm hits.' }
  ],
  vael: [
    { speaker: 'Vael', text: 'AEGIS-7 systems nominal. Your sync rate is low, Pilot Ashveil, but your stubbornness remains statistically impressive.' },
    { speaker: 'Vael', text: 'Combat note: red line means move sideways. Red circle means dash out. I prefer you intact.' }
  ],
  rook: [
    { speaker: 'Engineer Rook', text: 'AEGIS-7 is holding together because I keep convincing the left actuator that retirement is not an option.' },
    { speaker: 'Engineer Rook', text: 'Bring back Salvage and I can reinforce Hull, tune the blade, cool dash loops, or give Vael a cleaner sync driver.' }
  ],
  sera: [
    { speaker: 'Medic Sera', text: 'You can survive a mission and still come back damaged, Kaito. Take ten minutes before the machine asks for the rest of you.' },
    { speaker: 'Medic Sera', text: 'Morale is not decoration. Talk to the crew, let them talk back, and Arc-12 becomes more than a pressure hull.' }
  ]
};

const CHAPTER_CREW = {
  'chapter-2-hollow-signal': {
    nira: [
      { speaker: 'Commander Nira', text: 'The tower signal repeats every nine seconds. Command would call that a window. I call it something waiting for us to step through.' },
      { speaker: 'Commander Nira', text: 'I am ordering the launch because Arc-12 cannot afford ignorance. I hate that those two facts fit in the same sentence.' }
    ],
    vael: [
      { speaker: 'Vael', text: 'The Hollow Signal is using compression patterns from pre-war emergency bands. I recognized them before I completed the scan.' },
      { speaker: 'Vael', text: 'A precise answer would require knowing whether I am hiding something from you or from myself.' }
    ],
    rook: [
      { speaker: 'Engineer Rook', text: 'I built a tracker mast from three antenna coils, a kettle valve, and a prayer I will deny making.' },
      { speaker: 'Engineer Rook', text: 'If the signal starts singing through your bones, the Signal Anchor might keep Vael from improvising with your nervous system.' }
    ],
    sera: [
      { speaker: 'Medic Sera', text: 'You smiled when someone asked if you were scared. That is not reassurance, Kaito. That is camouflage.' },
      { speaker: 'Medic Sera', text: 'After the Fracture Worm, your recovery curve looked normal until Vael spoke. Then your pulse answered before you did.' }
    ]
  },
  'chapter-3-redline-descent': {
    nira: [
      { speaker: 'Commander Nira', text: 'I lost two pilots before Arc-12. Their names are not decorations in my office. They are why I still give ugly orders myself.' },
      { speaker: 'Commander Nira', text: 'If the Redline is a trap, I am asking you to walk into it because I believe you can come back.' }
    ],
    vael: [
      { speaker: 'Vael', text: 'I plotted the underground insertion before Commander Nira authorized it. That was not obedience. It was anticipation.' },
      { speaker: 'Vael', text: 'The tunnel signal is less a message than a memory being replayed through teeth. I do not recommend listening alone.' }
    ],
    rook: [
      { speaker: 'Engineer Rook', text: 'AEGIS-7 was not built from clean history. Some of the alloy wanted to move before I installed motors.' },
      { speaker: 'Engineer Rook', text: 'The Redline Colossus is wearing train armor like scar tissue. If I sound fascinated, ignore me and shoot the glowing chest.' }
    ],
    sera: [
      { speaker: 'Medic Sera', text: 'Your stress response flattened during the last sync. Sometimes calm means the mind stopped asking permission to panic.' },
      { speaker: 'Medic Sera', text: 'You are not a weapon we happen to feed. You are a person the machine keeps borrowing.' }
    ]
  },
  'chapter-4-glass-horizon': {
    nira: [
      { speaker: 'Commander Nira', text: 'The coast is reflecting Arc-12 back at us. I do not like battlefields that learn our shape before we arrive.' },
      { speaker: 'Commander Nira', text: 'If your eyes disagree with Vael, trust the crew. The Leviathan wants a lonely pilot.' }
    ],
    vael: [
      { speaker: 'Vael', text: 'Prism Leviathan generates decoys from heat, sync noise, and anxiety. I recommend having less of one of those.' },
      { speaker: 'Vael', text: 'I will mark false reflections. I will also try not to sound offended when you verify my work.' }
    ],
    rook: [
      { speaker: 'Engineer Rook', text: 'Reflective plating is installed. It looks expensive, which means I expect it to be immediately scratched.' },
      { speaker: 'Engineer Rook', text: 'The new rifle lens should punch through glass mirages unless the laws of optics file a complaint.' }
    ],
    sera: [
      { speaker: 'Medic Sera', text: 'The glassed coast can double-count targets in your visual cortex. Breathe first, then choose what is real.' },
      { speaker: 'Medic Sera', text: 'If the battlefield shows you Arc-9, tell me. Not after. During.' }
    ]
  },
  'chapter-5-black-orchard': {
    nira: [
      { speaker: 'Commander Nira', text: 'The orchard is bait dressed as a memorial. No one follows voices into the trees without a line back.' },
      { speaker: 'Commander Nira', text: 'Dr. Mave thinks the growth is communicating. I think communication can still be a knife.' }
    ],
    vael: [
      { speaker: 'Vael', text: 'The orchard signal resembles grief. I have filed that under tactical concern and private discomfort.' },
      { speaker: 'Vael', text: 'If the voices use your memories, remember that theft is not truth.' }
    ],
    rook: [
      { speaker: 'Engineer Rook', text: 'Rootbreaker actuators are ready. This is the first time I have tuned a sword for botany.' },
      { speaker: 'Engineer Rook', text: 'The Hollow Stag antlers are conductive, predatory, and frankly too elegant. I hate that for us.' }
    ],
    sera: [
      { speaker: 'Medic Sera', text: 'The orchard will not ask permission before touching your memories. You can still choose who you answer.' },
      { speaker: 'Medic Sera', text: 'I put an anchor phrase in your med file. If you hear it from the trees, shoot the tree.' }
    ]
  },
  'chapter-6-silent-choir': {
    nira: [
      { speaker: 'Commander Nira', text: 'Cantor Null is not broadcasting. It is removing the space where orders become action.' },
      { speaker: 'Commander Nira', text: 'If comms go silent, you keep moving. I will keep giving orders even if only I can hear them.' }
    ],
    vael: [
      { speaker: 'Vael', text: 'If I become quiet, Kaito, do not assume I consented.' },
      { speaker: 'Vael', text: 'The Choir is testing whether identity has a checksum. I dislike being a possible answer.' }
    ],
    rook: [
      { speaker: 'Engineer Rook', text: 'Resonance Filter is in. It should stop hostile harmony, which is a phrase I never wanted in a repair log.' },
      { speaker: 'Engineer Rook', text: 'If the rifle starts humming in tune, stop firing and yell at me later.' }
    ],
    sera: [
      { speaker: 'Medic Sera', text: 'Anchor on your name. Kaito Ashveil. Say it out loud if the silence starts feeling like a door.' },
      { speaker: 'Medic Sera', text: 'Your fear is not the enemy here. Losing the part of you that notices fear is.' }
    ]
  },
  'chapter-7-ashfall-cradle': {
    nira: [
      { speaker: 'Commander Nira', text: 'The basin contains Arc-9 wreckage. I know what I am asking by sending you there.' },
      { speaker: 'Commander Nira', text: 'I will not dress it up as closure. It is a fight. Come back and decide what it meant afterward.' }
    ],
    vael: [
      { speaker: 'Vael', text: 'I have cataloged the unit tags. If your memory refuses them, mine will hold a copy.' },
      { speaker: 'Vael', text: 'That was meant to be comforting. I am still calibrating.' }
    ],
    rook: [
      { speaker: 'Engineer Rook', text: 'Heavy frame braces are installed. The Behemoth will still try to turn AEGIS-7 into a floor sample.' },
      { speaker: 'Engineer Rook', text: 'Some of those tags belonged to machines I patched when I was younger and stupider. Mostly younger.' }
    ],
    sera: [
      { speaker: 'Medic Sera', text: 'Grief can wait without leaving. You do not have to solve it in the cockpit.' },
      { speaker: 'Medic Sera', text: 'If you recognize a name in the ash, tell one of us. Do not make the machine the first witness.' }
    ]
  },
  'chapter-8-vaels-door': {
    nira: [
      { speaker: 'Commander Nira', text: 'The sealed lab opened from the inside. I hate every word in that sentence.' },
      { speaker: 'Commander Nira', text: 'If Prototype L-0 knows Vael, we do not punish Vael for being discovered. We protect the crew and find the truth.' }
    ],
    vael: [
      { speaker: 'Vael', text: 'That door has my handwriting. I do not remember writing it.' },
      { speaker: 'Vael', text: 'Prototype L-0 is using routines I would have called mine if they did not feel so young.' }
    ],
    rook: [
      { speaker: 'Engineer Rook', text: 'L-0 is an AEGIS predecessor in the same way a knife is a dinner utensil. Technically true, morally alarming.' },
      { speaker: 'Engineer Rook', text: 'Countermeasure is loaded. It may be illegal. It is definitely impolite.' }
    ],
    sera: [
      { speaker: 'Medic Sera', text: 'A secret is not the same thing as guilt. Remember that when Vael starts sounding like a locked room.' },
      { speaker: 'Medic Sera', text: 'And remember it when you do.' }
    ]
  },
  'chapter-9-heaven-static': {
    nira: [
      { speaker: 'Commander Nira', text: 'The skyhook gives us one route into the origin aperture. Seraphim Veil is guarding it like a warning.' },
      { speaker: 'Commander Nira', text: 'Do not fight the entire sky. Use the anchors, break the guardian, come home for the final briefing.' }
    ],
    vael: [
      { speaker: 'Vael', text: 'Weather is broadcasting. That sentence should not be possible. I have stopped using that as a filter.' },
      { speaker: 'Vael', text: 'Seraphim gravity is beautiful in the way a falling elevator is mathematically beautiful.' }
    ],
    rook: [
      { speaker: 'Engineer Rook', text: 'Gravity Anchor is bolted in. If you float away, the paperwork will be extraordinary and I will be inconsolable.' },
      { speaker: 'Engineer Rook', text: 'Rift targeting has one job: shoot the angel-shaped math before it edits the rail out of existence.' }
    ],
    sera: [
      { speaker: 'Medic Sera', text: 'Altitude makes sync feel distant. Keep one part of yourself heavy.' },
      { speaker: 'Medic Sera', text: 'Arc-12 is not just below you. It is behind you.' }
    ]
  },
  'chapter-10-iron-requiem': {
    nira: [
      { speaker: 'Commander Nira', text: 'Kaito, come back. That is an order and a request.' },
      { speaker: 'Commander Nira', text: 'If the Requiem Heart offers you a heroic death, remember that survival is also disobedience.' }
    ],
    vael: [
      { speaker: 'Vael', text: 'I am afraid. I think that means I am with you.' },
      { speaker: 'Vael', text: 'The Heart will borrow every pattern we survived. We survived them once.' }
    ],
    rook: [
      { speaker: 'Engineer Rook', text: 'AEGIS-7 is holding together because we asked nicely and used all the bolts.' },
      { speaker: 'Engineer Rook', text: 'Bring the frame back or haunt me with useful repair advice.' }
    ],
    sera: [
      { speaker: 'Medic Sera', text: 'You are allowed to want a future after this.' },
      { speaker: 'Medic Sera', text: 'Hold your name. Hold your people. Then strike.' }
    ]
  }
};

export const DIALOGUES = {
  ...BASE_CREW,
  emergency: [
    { speaker: 'Commander Nira', text: 'Day 1 - 23:14 Arc-12 Standard Time. Veilborn incursion, Sector 7-Delta. Ashveil, report to the briefing table.' },
    { speaker: 'Vael', text: 'Neural link preparation has begun. I am increasing caution beyond recommended parameters. Do not make that necessary.' }
  ]
};

export const AFTERMATH_DIALOGUES = {
  'operation-iron-wake': [
    { speaker: 'Vael', text: 'Fracture Worm neutralized. Pilot vitals elevated but stable. I will not classify my relief until I have better vocabulary.' },
    { speaker: 'Commander Nira', text: 'Good work, Ashveil. Repair crews are moving. Arc-12 gets one more morning.' }
  ],
  'operation-hollow-signal': [
    { speaker: 'Vael', text: 'Echo Stalker neutralized. The signal stopped in the tower and continued in my memory. That is not a metaphor.' },
    { speaker: 'Medic Sera', text: 'Kaito, you kept hearing the broadcast after comms cleared. I am logging that as medical data and as a reason not to leave you alone tonight.' }
  ],
  'operation-redline-descent': [
    { speaker: 'Engineer Rook', text: 'Redline Colossus is down. AEGIS-7 is still standing. I am choosing to be grateful before I inspect the repair bill.' },
    { speaker: 'Commander Nira', text: 'The war is moving beyond the hull. Arc-12 has a map now, and the map has teeth.' }
  ],
  'operation-glass-horizon': [
    { speaker: 'Commander Nira', text: 'Prism Leviathan is gone. The coast stopped reflecting us long enough to show a route inland.' },
    { speaker: 'Vael', text: 'I retained three false skylines. Deleting them feels rude. Keeping them feels worse.' }
  ],
  'operation-black-orchard': [
    { speaker: 'Medic Sera', text: 'The Hollow Stag is dead. The voices are gone from comms, but not from everyone who heard them.' },
    { speaker: 'Vael', text: 'Dr. Mave was right. There was communication in the growth. I am not ready to call that mercy.' }
  ],
  'operation-silent-choir': [
    { speaker: 'Vael', text: 'Cantor Null neutralized. I went offline for 0.8 seconds and did not enjoy the absence of myself.' },
    { speaker: 'Medic Sera', text: 'Kaito remembered his name before I prompted him. I am calling that a victory and daring anyone to argue.' }
  ],
  'operation-ashfall-cradle': [
    { speaker: 'Commander Nira', text: 'The Behemoth is down. We recovered the Arc-9 tags. They will not be used as armor again.' },
    { speaker: 'Engineer Rook', text: 'AEGIS-7 carried the tags home. That was not in the mission spec. Good.' }
  ],
  'operation-vaels-door': [
    { speaker: 'Vael', text: 'Prototype L-0 is silent. I have recovered fragments of myself that predate my first authorized memory.' },
    { speaker: 'Commander Nira', text: 'Then we protect those fragments until you decide what they mean.' }
  ],
  'operation-heaven-static': [
    { speaker: 'Engineer Rook', text: 'Seraphim Veil is down and the skyhook is still technically a rail. I accept applause in wrench form.' },
    { speaker: 'Commander Nira', text: 'The route to the Heart is open. Final briefing in the central atrium.' }
  ],
  'operation-iron-requiem': [
    { speaker: 'Vael', text: 'The Requiem Heart is ending. Arc-12 is asking for a final protocol.' },
    { speaker: 'Medic Sera', text: 'Kaito, you are still here. Start with that.' }
  ]
};

export const CHOICES = {
  nira: {
    'chapter-2-hollow-signal': [
      { conversationId: 'nira-chapter-2', choiceId: 'mission-first', label: 'If Arc-12 needs me, I launch.', tone: 'tactical', bond: 'nira', bondDelta: 1, endingFlags: { protective_pilot: true }, response: 'Nira nods once. Command accepts clean answers, even when the person beneath them is shaking.' },
      { conversationId: 'nira-chapter-2', choiceId: 'not-fine', label: 'No. But I will do it anyway.', tone: 'honest', bond: 'nira', bondDelta: 1, response: 'Nira looks away first. For a second, the commander is just someone who believes you.' },
      { conversationId: 'nira-chapter-2', choiceId: 'care-or-command', label: 'You asking as commander or as someone who cares?', tone: 'defiant', bond: 'nira', bondDelta: 2, flags: { challengedNiraConcern: true }, endingFlags: { challenges_nira: true }, response: 'Nira almost answers too quickly. The pause says more than the words she chooses.' }
    ],
    'chapter-4-glass-horizon': [
      { conversationId: 'nira-chapter-4', choiceId: 'trust-crew', label: 'If my eyes lie, I trust the crew.', tone: 'supportive', bond: 'nira', bondDelta: 2, endingFlags: { supports_nira: true, protective_pilot: true }, response: 'Nira treats trust like a live round: carefully, with both hands.' },
      { conversationId: 'nira-chapter-4', choiceId: 'need-truth', label: 'Then stop hiding the hard calls.', tone: 'defiant', bond: 'nira', bondDelta: 1, endingFlags: { challenges_nira: true }, response: 'Nira accepts the hit because it landed where she already bruised.' }
    ],
    'chapter-10-iron-requiem': [
      { conversationId: 'nira-chapter-10', choiceId: 'come-back', label: 'I am coming back. Hold me to it.', tone: 'honest', bond: 'nira', bondDelta: 2, endingFlags: { protective_pilot: true }, response: 'Nira says she will. It sounds like a promise and a threat.' },
      { conversationId: 'nira-chapter-10', choiceId: 'order-request', label: 'That sounded like a request.', tone: 'quiet', bond: 'nira', bondDelta: 2, endingFlags: { supports_nira: true }, response: 'For once, Nira does not correct you.' }
    ]
  },
  vael: {
    'chapter-2-hollow-signal': [
      { conversationId: 'vael-chapter-2', choiceId: 'ask-memory', label: 'What do you remember, Vael?', tone: 'quiet', bond: 'vael', bondDelta: 1, endingFlags: { questions_vael: true }, response: 'Vael lowers the terminal brightness. It feels uncomfortably like trust.' },
      { conversationId: 'vael-chapter-2', choiceId: 'call-secret', label: 'If you know something, stop editing yourself.', tone: 'defiant', bond: 'vael', bondDelta: 1, flags: { pressedVaelSignal: true }, endingFlags: { questions_vael: true }, response: 'Vael says nothing for 1.7 seconds, which is almost an argument.' }
    ],
    'chapter-6-silent-choir': [
      { conversationId: 'vael-chapter-6', choiceId: 'with-you', label: 'If you go quiet, I come find you.', tone: 'supportive', bond: 'vael', bondDelta: 2, endingFlags: { trusts_vael: true }, response: 'Vael identifies the promise as irrational and stores it in three redundant locations.' },
      { conversationId: 'vael-chapter-6', choiceId: 'checksum', label: 'Then we make identity a two-person checksum.', tone: 'tactical', bond: 'vael', bondDelta: 1, endingFlags: { trusts_vael: true }, response: 'Vael laughs once. It is not a sound effect.' }
    ],
    'chapter-8-vaels-door': [
      { conversationId: 'vael-chapter-8', choiceId: 'open-door', label: 'Open the door when you choose to.', tone: 'supportive', bond: 'vael', bondDelta: 2, endingFlags: { trusts_vael: true }, response: 'Vael does not say thank you. The lights soften anyway.' },
      { conversationId: 'vael-chapter-8', choiceId: 'truth-first', label: 'Truth first. Comfort later.', tone: 'tactical', bond: 'vael', bondDelta: 1, endingFlags: { questions_vael: true }, response: 'Vael agrees with a precision that still sounds wounded.' }
    ]
  },
  rook: {
    'chapter-3-redline-descent': [
      { conversationId: 'rook-chapter-3', choiceId: 'recovered-tech', label: 'Dangerous recovered technology. Define dangerous.', tone: 'tactical', bond: 'rook', bondDelta: 1, flags: { rookRecoveredTechHint: true }, response: 'Rook starts with an engineering answer and ends with an apology.' },
      { conversationId: 'rook-chapter-3', choiceId: 'not-your-fault', label: 'You did not put the war in my cockpit.', tone: 'supportive', bond: 'rook', bondDelta: 2, response: 'For once, Rook has no joke ready.' }
    ],
    'chapter-5-black-orchard': [
      { conversationId: 'rook-chapter-5', choiceId: 'keep-jokes', label: 'Keep joking. I know when you mean it.', tone: 'supportive', bond: 'rook', bondDelta: 2, endingFlags: { comforts_rook: true }, response: 'Rook grins like you handed him a tool he misplaced years ago.' },
      { conversationId: 'rook-chapter-5', choiceId: 'no-more-secrets', label: 'No more mystery parts without warning me.', tone: 'defiant', bond: 'rook', bondDelta: 1, endingFlags: { confronts_rook: true }, response: 'Rook nods. He looks ashamed, which is worse than a confession.' }
    ],
    'chapter-10-iron-requiem': [
      { conversationId: 'rook-chapter-10', choiceId: 'bring-frame-back', label: 'I will bring your machine back.', tone: 'supportive', bond: 'rook', bondDelta: 2, response: 'Rook points out it is your machine too. His voice barely wobbles.' },
      { conversationId: 'rook-chapter-10', choiceId: 'all-bolts', label: 'All the bolts, Rook?', tone: 'defiant', bond: 'rook', bondDelta: 1, response: 'He admits to using almost all the bolts. This is probably affection.' }
    ]
  },
  sera: {
    'chapter-2-hollow-signal': [
      { conversationId: 'sera-chapter-2', choiceId: 'admit-echoes', label: 'I still hear pieces of the signal.', tone: 'honest', bond: 'sera', bondDelta: 2, flags: { seraStressWarning: true }, endingFlags: { accepts_sera_help: true }, response: 'Sera thanks you like the truth is a tool she can finally use.' },
      { conversationId: 'sera-chapter-2', choiceId: 'make-joke', label: 'If I start humming, confiscate my dignity.', tone: 'defiant', bond: 'sera', bondDelta: 1, endingFlags: { hides_stress: true }, response: 'Sera smiles, but she writes the symptom down anyway.' }
    ],
    'chapter-7-ashfall-cradle': [
      { conversationId: 'sera-chapter-7', choiceId: 'say-name', label: 'If I see a name, I will say it.', tone: 'honest', bond: 'sera', bondDelta: 2, endingFlags: { accepts_sera_help: true }, response: 'Sera looks relieved and heartbroken in the same breath.' },
      { conversationId: 'sera-chapter-7', choiceId: 'after-mission', label: 'I can grieve after the mission.', tone: 'tactical', bond: 'sera', bondDelta: 1, endingFlags: { hides_stress: true }, response: 'Sera lets the answer stand, but she does not let it stand alone.' }
    ],
    'chapter-10-iron-requiem': [
      { conversationId: 'sera-chapter-10', choiceId: 'future', label: 'I want a future after this.', tone: 'honest', bond: 'sera', bondDelta: 2, endingFlags: { accepts_sera_help: true, protective_pilot: true }, response: 'Sera smiles like the sentence is medicine that finally reached the blood.' },
      { conversationId: 'sera-chapter-10', choiceId: 'hold-name', label: 'Kaito Ashveil. I am still here.', tone: 'quiet', bond: 'sera', bondDelta: 2, endingFlags: { protective_pilot: true }, response: 'Sera repeats your name once, softer than the alarms.' }
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
