import * as THREE from 'three';
import { CHARACTERS } from '../data/characters.js';
import { ModelFactory } from '../game/ModelFactory.js';

export function createHubInteractables() {
  return [
    {
      id: 'nira',
      label: 'Commander Nira',
      character: CHARACTERS.nira,
      action: 'dialogue',
      room: 'nira-office',
      position: new THREE.Vector3(-31, 0, -2),
      model: ModelFactory.createCrew('red')
    },
    {
      id: 'vael',
      label: 'Vael Core',
      character: CHARACTERS.vael,
      action: 'dialogue',
      room: 'vael-sync-chamber',
      position: new THREE.Vector3(17, 0, -15),
      model: ModelFactory.createTerminal('blue')
    },
    {
      id: 'rook',
      label: 'Engineer Rook',
      character: CHARACTERS.rook,
      action: 'upgrade',
      room: 'engineering-deck',
      position: new THREE.Vector3(-18, 0, 21),
      model: ModelFactory.createCrew('amber')
    },
    {
      id: 'sera',
      label: 'Medic Sera',
      character: CHARACTERS.sera,
      action: 'dialogue',
      room: 'med-bay',
      position: new THREE.Vector3(20, 0, 0),
      model: ModelFactory.createCrew('blue')
    },
    {
      id: 'briefing',
      label: 'Briefing Table',
      action: 'briefing',
      room: 'briefing-room',
      position: new THREE.Vector3(0, 0, -16),
      model: ModelFactory.createTerminal('amber')
    },
    {
      id: 'hangar',
      label: 'Hangar Launch',
      action: 'hangar',
      room: 'hangar-bay',
      position: new THREE.Vector3(3, 0, 22),
      model: ModelFactory.createTerminal('red')
    },
    {
      id: 'map',
      label: 'Facility Map',
      action: 'map',
      room: 'central-atrium',
      position: new THREE.Vector3(-4.8, 0, -1.2),
      model: ModelFactory.createTerminal('blue')
    },
    {
      id: 'end-day',
      label: 'End Day Console',
      action: 'end-day',
      room: 'central-atrium',
      position: new THREE.Vector3(5, 0, 1.2),
      model: ModelFactory.createTerminal('amber')
    },
    {
      id: 'quarters',
      label: 'Pilot Quarters',
      action: 'rest',
      room: 'pilot-quarters',
      position: new THREE.Vector3(20, 0, 13),
      model: ModelFactory.createTerminal('amber')
    },
    {
      id: 'research',
      label: 'Research Lab',
      action: 'research',
      room: 'research-lab',
      position: new THREE.Vector3(31, 0, -15),
      model: ModelFactory.createTerminal('blue')
    },
    {
      id: 'observation',
      label: 'Observation Deck',
      action: 'observe',
      room: 'observation-deck',
      position: new THREE.Vector3(0, 0, -28),
      model: ModelFactory.createTerminal('blue')
    }
  ];
}
