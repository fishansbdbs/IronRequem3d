import './styles/main.css';
import './styles/ui.css';
import './styles/hub.css';
import './styles/battle.css';
import { Game } from './game/Game.js';

const game = new Game(document.getElementById('app'));
game.start();
