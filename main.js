import UIManager from './uiManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const mainMenu = document.getElementById('main-menu');
    const basicModeContainer = document.getElementById('basic-mode-container');
    const leisureModeContainer = document.getElementById('leisure-mode-container');
    const levelModeContainer = document.getElementById('level-mode-container');
    const rankingsContainer = document.getElementById('rankings-container');
    const settingsContainer = document.getElementById('settings-container');
    const helpContainer = document.getElementById('help-container');

    const basicModeButton = document.getElementById('basic-mode');
    const leisureModeButton = document.getElementById('leisure-mode');
    const levelModeButton = document.getElementById('level-mode');
    const rankingsButton = document.getElementById('rankings');
    const settingsButton = document.getElementById('settings');
    const helpButton = document.getElementById('help');

    const backToMainButtons = [
        document.getElementById('back-to-main'),
        document.getElementById('back-to-main-leisure'),
        document.getElementById('back-to-main-level'),
        document.getElementById('back-to-main-rankings'),
        document.getElementById('back-to-main-settings'),
        document.getElementById('back-to-main-help')
    ];

    basicModeButton.addEventListener('click', () => {
        mainMenu.style.display = 'none';
        basicModeContainer.style.display = 'block';
        const uiManager = new UIManager(8, 8, 8); // 可根据实际情况调整行数、列数和图片数量
    });

    leisureModeButton.addEventListener('click', () => {
        mainMenu.style.display = 'none';
        leisureModeContainer.style.display = 'block';
    });

    levelModeButton.addEventListener('click', () => {
        mainMenu.style.display = 'none';
        levelModeContainer.style.display = 'block';
    });

    rankingsButton.addEventListener('click', () => {
        mainMenu.style.display = 'none';
        rankingsContainer.style.display = 'block';
    });

    settingsButton.addEventListener('click', () => {
        mainMenu.style.display = 'none';
        settingsContainer.style.display = 'block';
    });

    helpButton.addEventListener('click', () => {
        mainMenu.style.display = 'none';
        helpContainer.style.display = 'block';
    });

    backToMainButtons.forEach(button => {
        button.addEventListener('click', () => {
            mainMenu.style.display = 'block';
            basicModeContainer.style.display = 'none';
            leisureModeContainer.style.display = 'none';
            levelModeContainer.style.display = 'none';
            rankingsContainer.style.display = 'none';
            settingsContainer.style.display = 'none';
            helpContainer.style.display = 'none';
        });
    });
});