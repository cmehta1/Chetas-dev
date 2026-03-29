import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig';
import EventBus from './EventBus';
import { ZONES } from './config/constants';
import { LEVELS } from './config/levelConfig';

const PhaserGame = forwardRef(function PhaserGame({ onGameReady }, ref) {
    const gameRef = useRef(null);
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        if (gameRef.current) return;

        const config = {
            ...gameConfig,
            parent: containerRef.current,
        };

        const game = new Phaser.Game(config);
        gameRef.current = game;

        if (ref) {
            ref.current = { game, scene: null };
        }

        EventBus.on('current-scene-ready', (scene) => {
            if (ref) {
                ref.current.scene = scene;
            }
            if (onGameReady) {
                onGameReady(game, scene);
            }
        });

        EventBus.on('minimap-jump', ({ zoneId }) => {
            const game = gameRef.current;
            if (!game) return;

            const zone = ZONES[zoneId];
            const level = LEVELS.find(l => l.zoneIds.includes(zoneId));
            if (!zone || !level) return;

            // Stop all active scenes
            game.scene.getScenes(true).forEach(s => game.scene.stop(s));

            game.scene.start('LevelTransition', {
                levelId: level.id,
                playerStage: zone.playerStage,
                targetZoneId: zoneId,
                collectedKeys: [],
                skillProficiency: {},
            });
        });

        return () => {
            EventBus.removeAllListeners();
            game.destroy(true);
            gameRef.current = null;
        };
    }, [ref]);

    return (
        <div
            ref={containerRef}
            id="game-container"
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
            }}
        />
    );
});

export default PhaserGame;
