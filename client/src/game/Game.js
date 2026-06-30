import * as THREE from 'three';
import { GAME_TITLE, PHASES } from '../../../shared/constants.js';
import {
  createInitialState,
  completeMission,
  markBriefingComplete,
  markLaunchWatched,
  recordDialogueChoice,
  returnToArc12,
  setPhase,
  startEmergency
} from './GameState.js';
import { loadGame, resetSave, saveGame } from './SaveManager.js';
import { InputManager } from './InputManager.js';
import { CameraController } from './CameraController.js';
import { AudioManager } from './AudioManager.js';
import { ModelFactory } from './ModelFactory.js';
import { VFXFactory } from './VFXFactory.js';
import { Arc12Hub } from '../hub/Arc12Hub.js';
import { spendForCrew } from '../hub/ActionPointSystem.js';
import { UpgradeBay } from '../hub/UpgradeBay.js';
import { BriefingScene } from '../launch/BriefingScene.js';
import { HangarScene } from '../launch/HangarScene.js';
import { LaunchSequence } from '../launch/LaunchSequence.js';
import { BattleScene } from '../battle/BattleScene.js';
import { DialogueSystem } from '../story/DialogueSystem.js';
import { ChapterManager } from '../story/ChapterManager.js';
import { DIALOGUES, INTRO_LINES, getAftermathDialogue, getCrewDialogue } from '../story/storyData.js';
import { getDialogueChoices } from '../story/ChoiceSystem.js';
import { getMissionByChapter, getMissionById } from '../data/missions.js';
import { Modal } from '../ui/Modal.js';
import { MainMenu } from '../ui/MainMenu.js';
import { HUD } from '../ui/HUD.js';
import { DialogueUI } from '../ui/DialogueUI.js';
import { UpgradeUI } from '../ui/UpgradeUI.js';
import { CrewBondUI } from '../ui/CrewBondUI.js';
import { PatchNotesUI } from '../ui/PatchNotesUI.js';
import { SettingsUI } from '../ui/SettingsUI.js';
import { BattleUI } from '../ui/BattleUI.js';
import { MissionResults } from '../ui/MissionResults.js';
import { FacilityMapUI } from '../ui/FacilityMapUI.js';

export class Game {
  constructor(root) {
    this.root = root;
    this.root.innerHTML = '<div class="game-shell"><div class="webgl-host"></div><div class="ui-host"></div></div>';
    this.webglHost = this.root.querySelector('.webgl-host');
    this.uiHost = this.root.querySelector('.ui-host');

    this.state = loadGame();
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x07090f);
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 500);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.shadowMap.enabled = true;
    this.webglHost.appendChild(this.renderer.domElement);

    this.input = new InputManager();
    this.input.attach(this.renderer.domElement);
    this.cameraController = new CameraController(this.camera);
    this.audio = new AudioManager();
    this.chapterManager = new ChapterManager();
    this.upgradeBay = new UpgradeBay();

    this.modal = new Modal(this.uiHost);
    this.hud = new HUD(this.uiHost);
    this.dialogueUI = new DialogueUI(this.uiHost);
    this.dialogues = new DialogueSystem(this.dialogueUI);
    this.battleUI = new BattleUI(this.uiHost);
    this.patchNotes = new PatchNotesUI(this.modal);
    this.facilityMap = new FacilityMapUI(this.modal);
    this.crewBonds = new CrewBondUI(this.modal);
    this.resultsUI = new MissionResults(this.modal);
    this.settingsUI = new SettingsUI(this.modal, {
      onApply: (settings) => this.applySettings(settings),
      onResetSave: () => this.resetSave()
    });
    this.upgradeUI = new UpgradeUI(this.modal, this.upgradeBay, (upgradeId) => this.purchaseUpgrade(upgradeId));
    this.menu = new MainMenu(this.uiHost, {
      onNewGame: () => this.newGame(),
      onContinue: () => this.continueGame(),
      onSettings: () => this.settingsUI.open(this.state.settings),
      onPatchNotes: () => this.patchNotes.open(),
      onCredits: () => this.showCredits()
    });
    this.installSmokeHooks();

    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  start() {
    this.setupLights();
    this.buildMenuBackdrop();
    this.menu.show();
    this.fetchServerStatus();
    this.animate();
  }

  getActiveMission() {
    const chapterMission = getMissionByChapter(this.state.currentChapter);
    const activeMission = getMissionById(this.state.activeMissionId);
    return activeMission?.chapterId === this.state.currentChapter ? activeMission : chapterMission;
  }

  setActiveMissionForChapter(chapterId = this.state.currentChapter) {
    const mission = getMissionByChapter(chapterId);
    this.state.activeMissionId = mission.id;
    return mission;
  }

  setupLights() {
    const hemi = new THREE.HemisphereLight(0x8bdfff, 0x160b12, 1.8);
    this.scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(6, 12, 8);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    this.scene.add(key);
  }

  clearScene() {
    this.currentScene?.dispose?.();
    this.currentScene = null;
    while (this.scene.children.length) {
      this.scene.remove(this.scene.children[0]);
    }
    this.setupLights();
  }

  buildMenuBackdrop() {
    this.clearScene();
    this.cameraController.setMode('menu');
    this.menuBackdrop = new THREE.Group();
    const aegis = ModelFactory.createAegis7(0.8);
    aegis.position.set(5, -0.5, -8);
    aegis.rotation.y = -0.45;
    this.menuBackdrop.add(aegis);
    const stars = VFXFactory.createStars(260, 180);
    this.menuBackdrop.add(stars);
    for (let i = 0; i < 24; i += 1) {
      const particle = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), ModelFactory.material('red'));
      particle.position.set((Math.random() - 0.5) * 36, Math.random() * 16, -8 - Math.random() * 35);
      particle.userData.speed = 0.5 + Math.random() * 1.5;
      this.menuBackdrop.add(particle);
    }
    this.scene.add(this.menuBackdrop);
    this.camera.position.set(0, 4, 13);
    this.camera.lookAt(1.5, 2, -8);
  }

  async fetchServerStatus() {
    const baseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
    try {
      const response = await fetch(`${baseUrl}/health`);
      this.menu.setServerStatus(await response.json());
    } catch {
      this.menu.setServerStatus({ ok: false });
    }
  }

  newGame() {
    this.audio.ui();
    this.state = createInitialState();
    saveGame(this.state);
    this.menu.hide();
    this.startIntro();
  }

  continueGame() {
    this.audio.ui();
    this.state = loadGame();
    this.menu.hide();
    if (this.state.storyFlags.introSeen) {
      this.enterHub();
    } else {
      this.startIntro();
    }
  }

  startIntro() {
    this.hud.hide();
    this.battleUI.hide();
    this.clearScene();
    this.buildMenuBackdrop();
    this.state = setPhase(this.state, PHASES.INTRO);
    const body = `
      <div class="intro-lines">
        ${INTRO_LINES.map((line) => `<p>${line}</p>`).join('')}
      </div>
    `;
    this.modal.open({
      title: GAME_TITLE,
      subtitle: 'Chapter 1 - Iron Wake',
      body,
      actions: [
        {
          label: 'Begin',
          kind: 'primary',
          onClick: () => {
            this.modal.close();
            this.state.storyFlags.introSeen = true;
            saveGame(this.state);
            this.enterHub();
          }
        }
      ]
    });
  }

  enterHub() {
    this.clearScene();
    this.state = setPhase(this.state, PHASES.HUB);
    saveGame(this.state);
    this.cameraController.setMode('hub');
    this.hud.show();
    this.battleUI.hide();
    this.currentScene = new Arc12Hub({
      scene: this.scene,
      cameraController: this.cameraController,
      state: this.state,
      onInteract: (item) => this.handleHubInteract(item)
    });
    this.currentScene.setEmergency(this.state.storyFlags.emergencyStarted);
    if (this.state.storyFlags.campaignComplete && !this.state.endingUnlocked && !this.endingPromptShown) {
      this.endingPromptShown = true;
      setTimeout(() => this.showEndingSelection(), 200);
    }
  }

  handleHubInteract(item) {
    this.audio.ui();
    if (item.action === 'dialogue') {
      this.playCrewDialogue(item.id);
    } else if (item.action === 'upgrade') {
      this.playCrewDialogue('rook', () => this.openUpgradeBay());
    } else if (item.action === 'briefing') {
      if (this.state.storyFlags.emergencyStarted) {
        this.openBriefing();
      } else {
        this.modal.open({
          title: 'Briefing Table',
          body: '<p>Nira has not called the mission yet. The table waits in low-power holographic standby.</p>',
          actions: [{ label: 'Close', kind: 'primary', onClick: () => this.modal.close() }]
        });
      }
    } else if (item.action === 'hangar') {
      if (this.state.storyFlags.briefingComplete) {
        this.enterHangar();
      } else {
        this.modal.open({
          title: 'Hangar Access',
          body: '<p>Launch rails are locked until mission briefing is complete.</p>',
          actions: [{ label: 'Close', kind: 'primary', onClick: () => this.modal.close() }]
        });
      }
    } else if (item.action === 'end-day') {
      this.endDay();
    } else if (item.action === 'map') {
      this.openFacilityMap();
    } else if (item.action === 'rest') {
      this.runFacilityActivity('quarters', {
        title: 'Pilot Quarters',
        body: '<p>Kaito takes one quiet hour beside the Arc-9 memory board. Hull recovery routines cycle while the room remembers how to be still.</p>'
      });
    } else if (item.action === 'research') {
      this.runFacilityActivity('research', {
        title: 'Research Lab',
        body: '<p>Recovered Veilborn samples rotate inside dark glass. Vael cross-checks Lira Mave notes and marks several patterns as almost language.</p>'
      });
    } else if (item.action === 'observe') {
      this.runFacilityActivity('observation', {
        title: 'Observation Deck',
        body: '<p>The aperture above Arc-12 pulses beyond the observation glass. Nira calls it weather. Vael does not correct her.</p>'
      });
    }
  }

  openFacilityMap() {
    this.audio.ui();
    this.facilityMap.open(this.state);
  }

  runFacilityActivity(activityId, { title, body }) {
    const beforeAp = this.state.ap.current;
    this.state = spendForCrew(this.state, activityId);
    saveGame(this.state);
    const spent = this.state.ap.current < beforeAp ? '<p class="reward">AP spent. Arc-12 state updated.</p>' : '<p class="reward">No AP spent. Activity already logged for today or AP is empty.</p>';
    this.modal.open({
      title,
      body: `${body}${spent}`,
      actions: [{ label: 'Close', kind: 'primary', onClick: () => this.modal.close() }]
    });
  }

  endDay() {
    this.audio.ui();
    if (!this.state.storyFlags.emergencyStarted) {
      this.state = startEmergency(this.state);
      saveGame(this.state);
      this.currentScene?.setEmergency?.(true);
      this.modal.open({
        title: 'Arc-12 Emergency',
        subtitle: this.chapterManager.getChapterLabel(this.state),
        body: '<p>Alert light floods the central atrium. Commander Nira authorizes AEGIS-7 deployment and routes Kaito to the briefing table.</p>',
        actions: [{ label: 'Report to Briefing', kind: 'primary', onClick: () => {
          this.modal.close();
          this.openBriefing();
        } }]
      });
      return;
    }

    this.state.day += 1;
    this.state.ap.current = this.state.ap.max;
    this.state.ap.spentActivities = [];
    saveGame(this.state);
    this.modal.open({
      title: `Day ${this.state.day}`,
      body: '<p>Arc-12 rolls into another watch cycle. Crew stations refresh and the facility hum drops back into routine tension.</p>',
      actions: [{ label: 'Continue', kind: 'primary', onClick: () => this.modal.close() }]
    });
  }

  playCrewDialogue(crewId, afterComplete) {
    const before = this.state;
    this.state = spendForCrew(this.state, crewId);
    saveGame(this.state);
    const lines = getCrewDialogue(crewId, this.state);
    const choices = getDialogueChoices(crewId, this.state);
    let selectedChoice = null;
    this.dialogues.play(lines, {
      choices,
      onChoice: (choice) => {
        if (choice) {
          selectedChoice = choice;
          this.state = recordDialogueChoice(this.state, choice);
          saveGame(this.state);
        }
      },
      onComplete: () => {
        const finish = () => {
          if (before.ap.current === this.state.ap.current && this.state.ap.current <= 0) {
            this.hud.update(this.state, { prompt: 'End Day available', chapter: this.chapterManager.getChapterLabel(this.state) });
          }
          afterComplete?.();
        };

        if (selectedChoice?.response) {
          const delta = selectedChoice.bondDelta ? ` Bond ${selectedChoice.bondDelta > 0 ? '+' : ''}${selectedChoice.bondDelta}.` : '';
          this.dialogues.play([{ speaker: 'Arc-12', text: `${selectedChoice.response}${delta}` }], {
            onComplete: finish
          });
        } else {
          finish();
        }
      }
    });
  }

  openBriefing() {
    const mission = this.setActiveMissionForChapter();
    this.state = setPhase(this.state, PHASES.BRIEFING);
    saveGame(this.state);
    const briefing = new BriefingScene({
      modal: this.modal,
      mission,
      onLaunch: () => {
        this.modal.close();
        this.enterHangar();
      }
    });
    briefing.show();
  }

  enterHangar() {
    const mission = this.getActiveMission();
    this.clearScene();
    this.state = markBriefingComplete(this.state);
    this.state = setPhase(this.state, PHASES.HANGAR);
    saveGame(this.state);
    this.hud.show();
    this.cameraController.setMode('menu');
    this.currentScene = new HangarScene({ scene: this.scene, mission });
    this.camera.position.set(6, 5, 13);
    this.camera.lookAt(0, 2.8, 1);
    this.modal.open({
      title: 'AEGIS-7 Launch Bay',
      subtitle: mission.launchSubtitle,
      body: `<p>${mission.launchBody}</p>`,
      actions: [
        { label: `Launch ${mission.name}`, kind: 'primary', onClick: () => this.startLaunch() },
        { label: 'Crew Bonds', kind: 'secondary', onClick: () => this.crewBonds.open(this.state) }
      ]
    });
  }

  startLaunch() {
    const mission = this.getActiveMission();
    this.modal.close();
    this.clearScene();
    this.hud.show();
    this.state = markLaunchWatched(this.state);
    this.state = setPhase(this.state, PHASES.LAUNCH);
    saveGame(this.state);
    this.currentScene = new LaunchSequence({
      scene: this.scene,
      camera: this.camera,
      overlay: this.hud,
      audio: this.audio,
      mission,
      onComplete: () => this.enterBattle()
    });
  }

  enterBattle() {
    const mission = this.getActiveMission();
    this.clearScene();
    this.hud.hide();
    this.battleUI.show();
    this.cameraController.setMode('battle');
    this.state = setPhase(this.state, PHASES.BATTLE);
    saveGame(this.state);
    this.currentScene = new BattleScene({
      scene: this.scene,
      cameraController: this.cameraController,
      state: this.state,
      audio: this.audio,
      battleUI: this.battleUI,
      mission,
      onVictory: (results) => this.finishBattle(results)
    });
  }

  finishBattle(results) {
    const mission = getMissionById(results.missionId) || this.getActiveMission();
    const reward = mission.reward;
    const unlockLabels = {
      'operation-iron-wake': 'Chapter 2 - Hollow Signal',
      'operation-hollow-signal': 'Chapter 3 - Redline Descent',
      'operation-redline-descent': 'Chapter 4 - Glass Horizon',
      'operation-glass-horizon': 'Chapter 5 - Black Orchard',
      'operation-black-orchard': 'Chapter 6 - Silent Choir',
      'operation-silent-choir': 'Chapter 7 - Ashfall Cradle',
      'operation-ashfall-cradle': "Chapter 8 - Vael's Door",
      'operation-vaels-door': 'Chapter 9 - Heaven Static',
      'operation-heaven-static': 'Chapter 10 - Iron Requiem',
      'operation-iron-requiem': 'Final Protocol Available'
    };
    const enrichedResults = {
      ...results,
      missionId: mission.id,
      missionName: mission.name,
      bossDefeated: mission.enemy,
      salvage: reward.salvage,
      sync: reward.sync,
      chapterUnlocked: unlockLabels[mission.id]
    };
    this.currentScene?.dispose?.();
    this.currentScene = null;
    this.battleUI.hide();
    this.state = completeMission(this.state, {
      missionId: mission.id,
      salvage: reward.salvage,
      sync: reward.sync,
      result: enrichedResults
    });
    this.state = setPhase(this.state, PHASES.RESULTS);
    saveGame(this.state);
    this.dialogues.play(getAftermathDialogue(mission.id), {
      onComplete: () => this.resultsUI.open(enrichedResults, () => {
        this.modal.close();
        const finalMission = mission.id === 'operation-iron-requiem';
        this.state = returnToArc12(this.state);
        saveGame(this.state);
        this.enterHub();
        if (finalMission) {
          this.showEndingSelection();
        }
      })
    });
  }

  showEndingSelection() {
    const endingCopy = {
      'hold-arc12': {
        label: 'Hold Arc-12',
        text: 'Kaito and the crew keep Arc-12 in the fight, turning the station into a shield instead of a tomb.'
      },
      'sever-the-choir': {
        label: 'Sever the Choir',
        text: 'Vael cuts the Requiem signal from the Veilborn network, leaving the sky quiet and dangerous in a human way.'
      },
      'vael-open-door': {
        label: "Vael's Open Door",
        text: 'Kaito trusts Vael to open a controlled aperture, proving the AI is more than a weapon system.'
      },
      'evacuate-and-return': {
        label: 'Evacuate and Return',
        text: 'Nira orders Arc-12 civilians away before the crew returns to finish what the war started.'
      },
      'become-the-lock': {
        label: 'Become the Lock',
        text: 'Kaito binds his sync to the aperture long enough to seal it, leaving Arc-12 alive and his future uncertain.'
      }
    };
    const options = this.state.endingOptions.length ? this.state.endingOptions : ['hold-arc12', 'sever-the-choir'];
    const body = `
      <div class="ending-options">
        ${options.map((id) => `<p><strong>${endingCopy[id]?.label || id}</strong><br>${endingCopy[id]?.text || 'Arc-12 records an unresolved ending route.'}</p>`).join('')}
      </div>
    `;
    this.modal.open({
      title: 'Final Protocol',
      subtitle: 'Arc-12 Campaign Complete',
      body,
      actions: options.map((id) => ({
        label: endingCopy[id]?.label || id,
        kind: id === 'hold-arc12' ? 'primary' : 'secondary',
        onClick: () => this.chooseEnding(id, endingCopy[id])
      }))
    });
  }

  chooseEnding(endingId, ending) {
    this.state.endingUnlocked = endingId;
    saveGame(this.state);
    this.modal.open({
      title: ending?.label || 'Arc-12 Ending',
      subtitle: 'Iron Requiem',
      body: `<p>${ending?.text || 'Arc-12 records the final protocol.'}</p><p class="reward">Campaign saved. ${this.state.completedMissions.length} operations completed.</p>`,
      actions: [{ label: 'Return to Arc-12', kind: 'primary', onClick: () => this.modal.close() }]
    });
  }

  applySettings(settings) {
    this.state.settings = { ...this.state.settings, ...settings };
    this.audio.applySettings(this.state.settings);
    saveGame(this.state);
  }

  resetSave() {
    this.state = resetSave();
    this.audio.ui();
    this.modal.close();
    this.menu.show();
    this.hud.hide();
    this.battleUI.hide();
    this.buildMenuBackdrop();
  }

  showCredits() {
    this.modal.open({
      title: 'Credits',
      body: '<p>Built as a clean procedural Three.js remaster prototype. Old Iron Requiem material was used only as terminology and story reference.</p>',
      actions: [{ label: 'Close', kind: 'primary', onClick: () => this.modal.close() }]
    });
  }

  closeSmokeOverlays() {
    this.modal.close();
    this.dialogueUI.el.classList.add('hidden');
    this.menu.hide();
  }

  prepareSmokeChapter(chapterId) {
    const chapterOrder = [
      'chapter-1-iron-wake',
      'chapter-2-hollow-signal',
      'chapter-3-redline-descent',
      'chapter-4-glass-horizon',
      'chapter-5-black-orchard',
      'chapter-6-silent-choir',
      'chapter-7-ashfall-cradle',
      'chapter-8-vaels-door',
      'chapter-9-heaven-static',
      'chapter-10-iron-requiem'
    ];
    let state = createInitialState();
    state.storyFlags.introSeen = true;
    state.storyFlags.emergencyStarted = true;
    const targetIndex = Math.max(0, chapterOrder.indexOf(chapterId));

    for (let index = 0; index < targetIndex; index += 1) {
      const mission = getMissionByChapter(chapterOrder[index]);
      state = completeMission(state, {
        missionId: mission.id,
        salvage: mission.reward.salvage,
        sync: mission.reward.sync,
        result: { missionName: mission.name, enemiesDefeated: 3 + index, bossDefeated: mission.enemy }
      });
      state = returnToArc12(state);
      state.storyFlags.emergencyStarted = true;
    }

    state.currentChapter = chapterId;
    state.activeMissionId = getMissionByChapter(chapterId).id;
    state.currentPhase = PHASES.HUB;
    this.state = state;
    saveGame(this.state);
  }

  installSmokeHooks() {
    const host = window.location.hostname;
    if (!['localhost', '127.0.0.1', ''].includes(host)) return;
    const chapterIds = {
      ch1: 'chapter-1-iron-wake',
      ch2: 'chapter-2-hollow-signal',
      ch3: 'chapter-3-redline-descent',
      ch4: 'chapter-4-glass-horizon',
      ch5: 'chapter-5-black-orchard',
      ch6: 'chapter-6-silent-choir',
      ch7: 'chapter-7-ashfall-cradle',
      ch8: 'chapter-8-vaels-door',
      ch9: 'chapter-9-heaven-static',
      ch10: 'chapter-10-iron-requiem'
    };
    const jumpToChapter = (chapterId) => {
      this.closeSmokeOverlays();
      this.prepareSmokeChapter(chapterId);
      this.enterHub();
      return this.state;
    };
    const startChapterBattle = (chapterId) => {
      jumpToChapter(chapterId);
      this.state.storyFlags.briefingComplete = true;
      this.state.activeMissionId = getMissionByChapter(chapterId).id;
      saveGame(this.state);
      this.enterBattle();
      return this.currentScene;
    };
    const smoke = {
      state: () => structuredClone(this.state),
      phase: () => this.state.currentPhase,
      crew: (crewId) => this.playCrewDialogue(crewId),
      chapter1: () => jumpToChapter(chapterIds.ch1),
      chapter2: () => jumpToChapter(chapterIds.ch2),
      chapter3: () => jumpToChapter(chapterIds.ch3),
      chapter4: () => jumpToChapter(chapterIds.ch4),
      chapter5: () => jumpToChapter(chapterIds.ch5),
      chapter6: () => jumpToChapter(chapterIds.ch6),
      chapter7: () => jumpToChapter(chapterIds.ch7),
      chapter8: () => jumpToChapter(chapterIds.ch8),
      chapter9: () => jumpToChapter(chapterIds.ch9),
      chapter10: () => jumpToChapter(chapterIds.ch10),
      endDay: () => this.endDay(),
      map: () => this.openFacilityMap(),
      briefing: () => {
        if (!this.state.storyFlags.emergencyStarted) {
          this.state = startEmergency(this.state);
        }
        this.openBriefing();
      },
      hangar: () => this.enterHangar(),
      launch: () => this.startLaunch(),
      battle: () => this.enterBattle(),
      battleChapter1: () => startChapterBattle(chapterIds.ch1),
      battleChapter2: () => startChapterBattle(chapterIds.ch2),
      battleChapter3: () => startChapterBattle(chapterIds.ch3),
      battleChapter4: () => startChapterBattle(chapterIds.ch4),
      battleChapter5: () => startChapterBattle(chapterIds.ch5),
      battleChapter6: () => startChapterBattle(chapterIds.ch6),
      battleChapter7: () => startChapterBattle(chapterIds.ch7),
      battleChapter8: () => startChapterBattle(chapterIds.ch8),
      battleChapter9: () => startChapterBattle(chapterIds.ch9),
      battleChapter10: () => startChapterBattle(chapterIds.ch10),
      battleDebug: () => this.currentScene instanceof BattleScene ? ({
        missionId: this.currentScene.mission.id,
        boss: this.currentScene.boss.name,
        bossHp: this.currentScene.boss.hp,
        bossPhase: this.currentScene.boss.phase,
        telegraphs: this.currentScene.telegraphs.telegraphs.length,
        adds: this.currentScene.boss.adds.length,
        attackIndex: this.currentScene.boss.attackIndex,
        mechaAnimations: { ...this.currentScene.mecha.animations },
        resultReady: this.currentScene.victoryTimer !== null
      }) : null,
      defeatBoss: () => {
        if (this.currentScene instanceof BattleScene) {
          this.currentScene.boss.damage(9999);
          this.currentScene.finishVictory();
        }
      },
      reset: () => this.resetSave()
    };
    window.__IRON_REQUIEM_SMOKE__ = smoke;
    if (!new URLSearchParams(window.location.search).has('smoke')) return;

    const panel = document.createElement('div');
    panel.className = 'smoke-panel';
    this.smokeDebugEl = document.createElement('pre');
    this.smokeDebugEl.className = 'smoke-debug';
    const actions = [
      ...Object.keys(chapterIds).map((key) => [`${key.toUpperCase()} Hub`, smoke[`chapter${key.replace('ch', '')}`]]),
      ['Nira', () => smoke.crew('nira')],
      ['Vael', () => smoke.crew('vael')],
      ['Rook', () => smoke.crew('rook')],
      ['Sera', () => smoke.crew('sera')],
      ['Map', smoke.map],
      ['End Day', smoke.endDay],
      ['Briefing', smoke.briefing],
      ['Hangar', smoke.hangar],
      ['Launch', smoke.launch],
      ...Object.keys(chapterIds).map((key) => [`${key.toUpperCase()} Battle`, smoke[`battleChapter${key.replace('ch', '')}`]]),
      ['Defeat Boss', smoke.defeatBoss]
    ];

    actions.forEach(([label, action]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.dataset.smoke = label;
      button.addEventListener('click', () => action());
      panel.appendChild(button);
    });
    panel.appendChild(this.smokeDebugEl);
    this.uiHost.appendChild(panel);
  }

  updateSmokeDebug() {
    if (!this.smokeDebugEl) return;
    const battle = this.currentScene instanceof BattleScene ? {
      missionId: this.currentScene.mission.id,
      boss: this.currentScene.boss.name,
      bossHp: this.currentScene.boss.hp,
      bossPhase: this.currentScene.boss.phase,
      telegraphs: this.currentScene.telegraphs.telegraphs.length,
      adds: this.currentScene.boss.adds.length,
      attackIndex: this.currentScene.boss.attackIndex,
      mechaAnimations: { ...this.currentScene.mecha.animations },
      resultReady: this.currentScene.victoryTimer !== null
    } : null;
    this.smokeDebugEl.textContent = JSON.stringify({
      phase: this.state.currentPhase,
      chapter: this.state.currentChapter,
      activeMissionId: this.state.activeMissionId,
      objective: this.state.objective,
      prototypeComplete: this.state.storyFlags.prototypeComplete,
      campaignComplete: this.state.storyFlags.campaignComplete,
      facility: this.state.facility,
      endingOptions: this.state.endingOptions,
      completedMissions: this.state.completedMissions,
      unlockedChapters: this.state.unlockedChapters,
      battle
    });
  }

  resize() {
    const width = this.webglHost.clientWidth || window.innerWidth;
    const height = this.webglHost.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const dt = Math.min(0.05, this.clock.getDelta());

    if (this.menuBackdrop) {
      this.menuBackdrop.rotation.y += dt * 0.025;
      this.menuBackdrop.children.forEach((child) => {
        if (child.userData.speed) {
          child.position.z += child.userData.speed * dt;
          if (child.position.z > 10) child.position.z = -45;
        }
      });
    }

    if (this.currentScene instanceof Arc12Hub) {
      if (this.input.consumePressed('KeyM')) {
        this.openFacilityMap();
      }
      const prompt = this.currentScene.update(dt, this.input, this.state);
      this.cameraController.update(this.currentScene.player, this.input, dt, this.state.settings.mouseSensitivity);
      this.hud.update(this.state, {
        prompt,
        chapter: this.chapterManager.getChapterLabel(this.state),
        mode: 'hub'
      });
    } else if (this.currentScene instanceof HangarScene) {
      this.currentScene.update(dt);
      this.hud.update(this.state, {
        prompt: 'Launch controls ready',
        chapter: 'AEGIS-7 Hangar',
        mode: 'hub'
      });
    } else if (this.currentScene instanceof LaunchSequence) {
      this.currentScene.update(dt);
      if (this.input.consumePressed('Escape')) this.currentScene.skip();
    } else if (this.currentScene instanceof BattleScene) {
      const battleScene = this.currentScene;
      battleScene.update(dt, this.input);
      if (this.currentScene === battleScene) {
        this.cameraController.update(battleScene.aegis, this.input, dt, this.state.settings.mouseSensitivity);
      }
    }

    this.updateSmokeDebug();

    this.renderer.render(this.scene, this.camera);
    this.input.frameEnd();
  }
}
