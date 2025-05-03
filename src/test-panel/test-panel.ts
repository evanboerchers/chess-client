import { GameState } from "@evanboerchers/chess-core";
import { Scenarios, ScenarioSave, GameWindowInterface } from "./test-panel.types";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL + '/api/test-scenarios';

if(!API_BASE_URL) throw Error('No api url')

const saveNameInput = document.getElementById('save-name') as HTMLInputElement;
const saveButton = document.getElementById('save-btn') as HTMLButtonElement;
const saveStatus = document.getElementById('save-status') as HTMLDivElement;
const savedStatesSelect = document.getElementById('saved-states') as HTMLSelectElement;
const loadButton = document.getElementById('load-btn') as HTMLButtonElement;
const loadStatus = document.getElementById('load-status') as HTMLDivElement;
const refreshButton = document.getElementById('refresh-btn') as HTMLButtonElement;

function showStatus(element: HTMLDivElement, message: string, isSuccess: boolean): void {
    element.textContent = message;
    element.style.display = 'block';
    
    if (isSuccess) {
        element.classList.add('success');
        element.classList.remove('error');
    } else {
        element.classList.add('error');
        element.classList.remove('success');
    }
    
    // Clear the status after 3 seconds
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

function getGameInterface(): GameWindowInterface {
    const opener = window.opener
    const windowInterface = opener?.gameInterface
    if (opener && windowInterface){
        return windowInterface
    } else {
        showStatus(saveStatus, "Cannot access the main game window interface methods", false);
        throw Error('Opener window does not have valid interface')
    }
}

function getGameState(): GameState | null {
    const windowInterface = getGameInterface();
    return windowInterface.getChessGameState();
}

async function saveGameState(name: string, gameState: GameState): Promise<ScenarioSave> {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                data: gameState
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to save game state');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error saving game state:', error);
        throw error;
    }
}

async function fetchGameStates(): Promise<string[]> {
    try {
        const response = await fetch(`${API_BASE_URL}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch saved games');
        }
        
        const data = await response.json() as Scenarios;
        return data.scenarios;
    } catch (error) {
        console.error('Error fetching game states:', error);
        throw error;
    }
}

async function fetchGameState(name: string): Promise<GameState> {
    try {
        const response = await fetch(`${API_BASE_URL}/${name}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch game state');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching game state:', error);
        throw error;
    }
}

async function populateGameStates(): Promise<void> {
    try {
        while (savedStatesSelect.options.length > 1) {
            savedStatesSelect.remove(1);
        }
        
        const gameStates = await fetchGameStates();
        
        gameStates.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            savedStatesSelect.appendChild(option);
        });
        
        if (gameStates.length === 0) {
            const option = document.createElement('option');
            option.disabled = true;
            option.textContent = "No saved game states found";
            savedStatesSelect.appendChild(option);
        }
    } catch (error) {
        showStatus(loadStatus, "Failed to load saved game states", false);
    }
}

saveButton.addEventListener('click', async () => {
    const name = saveNameInput.value.trim();
    
    if (!name) {
        showStatus(saveStatus, "Please enter a name for the game state", false);
        return;
    }
    
    const gameState = getGameState();
    
    if (!gameState) {
        return; 
    }
    
    try {
        await saveGameState(name, gameState);
        showStatus(saveStatus, "Game state saved successfully!", true);
        saveNameInput.value = '';
        await populateGameStates(); // Refresh the list
    } catch (error) {
        showStatus(saveStatus, "Failed to save game state", false);
    }
});

loadButton.addEventListener('click', async () => {
    const selectedId = savedStatesSelect.value;
    
    if (!selectedId) {
        showStatus(loadStatus, "Please select a game state to load", false);
        return;
    }
    
    try {
        const gameState = await fetchGameState(selectedId);

            const gameInterface =getGameInterface()
            
            if (gameInterface.loadChessGameState(gameState)){
                showStatus(loadStatus, "Game state loaded successfully!", true);
            } else {
            showStatus(loadStatus, "Cannot access the main game window", false);
            }
    } catch (error) {
        showStatus(loadStatus, "Failed to load game state", false);
    }
});

refreshButton.addEventListener('click', async () => {
    await populateGameStates();
    showStatus(loadStatus, "Game state list refreshed", true);
});

// Initialize the control panel
window.addEventListener('DOMContentLoaded', async () => {
    await populateGameStates();
});