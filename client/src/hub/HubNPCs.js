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
      position: new THREE.Vector3(-6, 0, -5),
      model: ModelFactory.createCrew('red')
    },
    {
      id: 'vael',
      label: 'Vael Terminal',
      character: CHARACTERS.vael,
      action: 'dialogue',
      position: new THREE.Vector3(5.5, 0, -4.8),
      model: ModelFactory.createTerminal('blue')
    },
    {
      id: 'rook',
      label: 'Engineer Rook',
      character: CHARACTERS.rook,
      action: 'upgrade',
      position: new THREE.Vector3(-5.8, 0, 4.5),
      model: ModelFactory.createCrew('amber')
    },
    {
      id: 'sera',
      label: 'Medic Sera',
      character: CHARACTERS.sera,
      action: 'dialogue',
      position: new THREE.Vector3(5.2, 0, 4.5),
      model: ModelFactory.createCrew('blue')
    },
    {
      id: 'briefing',
      label: 'Briefing Table',
      action: 'briefing',
      position: new THREE.Vector3(0, 0, -6.8),
      model: ModelFactory.createTerminal('amber')
    },
    {
      id: 'hangar',
      label: 'Hangar Access',
      action: 'hangar',
      position: new THREE.Vector3(0, 0, 7.4),
      model: ModelFactory.createTerminal('red')
    },
    {
      id: 'end-day',
      label: 'End Day Console',
      action: 'end-day',
      position: new THREE.Vector3(7.1, 0, 0.6),
      model: ModelFactory.createTerminal('amber')
    }
  ];
}
