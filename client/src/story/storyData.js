export const INTRO_LINES = [
  'The sky cracked open the day the Veilborn arrived.',
  'Cities fell beneath shapes that should not exist.',
  'Humanity answered with machines too heavy to dream and pilots too young to carry the weight.',
  'Aboard Arc-12, Kaito Ashveil prepares to sync with AEGIS-7 - a machine built not to win a war, but to survive one more day.'
];

export const DIALOGUES = {
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
  ],
  emergency: [
    {
      speaker: 'Commander Nira',
      text: 'Day 1 - 23:14 Arc-12 Standard Time. Veilborn incursion, Sector 7-Delta. Ashveil, report to the briefing table.'
    },
    {
      speaker: 'Vael',
      text: 'Neural link preparation has begun. I am increasing caution beyond recommended parameters. Do not make that necessary.'
    }
  ],
  aftermath: [
    {
      speaker: 'Vael',
      text: 'Fracture Worm neutralized. Pilot vitals elevated but stable. I will not classify my relief until I have better vocabulary.'
    },
    {
      speaker: 'Commander Nira',
      text: 'Good work, Ashveil. Repair crews are moving. Arc-12 gets one more morning.'
    }
  ]
};

export const CHOICES = [
  { id: 'tactical', label: 'Tactical', bond: 'nira' },
  { id: 'supportive', label: 'Supportive', bond: 'sera' },
  { id: 'defiant', label: 'Defiant', bond: 'vael' }
];
