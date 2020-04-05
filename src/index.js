import * as PIXI from "pixi.js";
import Charm from "./lib/charm-master/bin/Charm.js";
import "./images/back.png";
import "./images/plant.png";
import "./images/bigplant.png";
import "./images/table.png";
import "./images/globe.png";
import "./images/bookstand.png";
import "./images/sofa.png";
import "./images/stair_old.png";
import "./images/stair_1.png";
import "./images/stair_2.png";
import "./images/stair_3.png";
import "./images/stair_carpet_1.png";
import "./images/stair_carpet_2.png";
import "./images/stair_carpet_3.png";
import "./images/stair_holders_1.png";
import "./images/stair_holders_2.png";
import "./images/stair_holders_3.png";
import "./images/btn_continue.png";
import "./images/final.png";
import "./images/final_back.png";
import "./images/logo.png";
import "./images/btn_ok.png";
import "./images/hammer.png";
import "./images/pad.png";
import "./images/pad_chosen.png";
import "./images/pad_pressed.png";
import "./images/stair_tmb_1.png";
import "./images/stair_tmb_2.png";
import "./images/stair_tmb_3.png";
import "./images/man.png";

import {sceneItems} from "./data/data";

window.PIXI = PIXI;

let Application = PIXI.Application;
let Sprite = PIXI.Sprite;
let charm = new Charm(PIXI);

let app = new Application({
        width: 1390,
        height: 640,
        antialias: true,
        transparent: false,
        resolution: 1
    }
);

let resources = app.loader.resources;

document.body.appendChild(app.view);

const textureList = ["./images/back.png"];
sceneItems.map(item => {
    if (!textureList.includes(item.resource)) {
        textureList.push(item.resource);
    }
});

app.loader
    .add(textureList)
    .load(setup);

let decorations = {};
let itemGroups = {};
let back;
let selectedPadNumber;

function setup() {
    back = new Sprite(resources["./images/back.png"].texture);
    app.stage.addChild(back);
    sceneItems.map(item => {
        if (!itemGroups[item.group]) itemGroups[item.group] = new PIXI.Container();
        decorations[item.name] = new Sprite(resources[item.resource].texture);
        decorations[item.name].anchor.x = decorations[item.name].anchor.y = 0.5;
        decorations[item.name].position.set(item.x + decorations[item.name].width / 2, item.y + decorations[item.name].height / 2);
        decorations[item.name].visible = item.visible;
        itemGroups[item.group].addChild(decorations[item.name]);
    })

    decorations.man.scale.x = -1;

    decorations.hammer.interactive = true;
    decorations.hammer.on('mousedown', onHammerDown);
    decorations.hammer.on('touchstart', onHammerDown);

    for (let i = 1; i <= 3; i++) {
        setMenuPad(i);
    }

    for (let key in itemGroups) {
        app.stage.addChild(itemGroups[key]);
    }

    itemGroups.stair_1.visible = false;
    itemGroups.stair_2.visible = false;
    itemGroups.stair_3.visible = false;
    app.ticker.add(delta => gameLoop(delta));
    hammerAppear();
    setContinueButton();
}

function gameLoop(delta) {
    charm.update();
}

function setContinueButton() {
    charm.strobe(decorations.btnContinue, 1.05, 1, 1, 60);
}
function setMenuPad(num) {
    decorations[`pad_${num}`].interactive = true;
    decorations[`pad_${num}`].on('mousedown', () => onPadDown(num));
    decorations[`pad_${num}`].on('touchstart', () => onPadDown(num));
    decorations[`pad_${num}_ok`].interactive = true;
    decorations[`pad_${num}_ok`].on('mousedown', onMenuDown);
    decorations[`pad_${num}_ok`].on('touchstart', onMenuDown);
}

function hammerAppear() {
    let endPosition = decorations.hammer.y;
    decorations.hammer.y -= 100;
    decorations.hammer.alpha = 0;
    charm.slide(decorations.hammer, decorations.hammer.x, endPosition, 20, "acceleration")
        .onComplete = () => charm.slide(decorations.hammer, decorations.hammer.x, endPosition - 10, 5, "acceleration")
        .onComplete = () => charm.slide(decorations.hammer, decorations.hammer.x, endPosition, 5, "acceleration");
    charm.fadeIn(decorations.hammer, 30);
}
function hammerHide() {
    charm.fadeOut(decorations.hammer, 3)
        .onComplete = () => {
            decorations.hammer.visible = false;
        };
}

function padAppear(padName) {
    let animation = function(spriteName) {
        decorations[spriteName].visible = true;
        decorations[spriteName].alpha = 0;
        decorations[spriteName].scale.x = decorations[spriteName].scale.y = 0.5;

        charm.fadeIn(decorations[spriteName], 30);

        charm.scale(decorations[spriteName], 1.15, 1.15, 15)
            .onComplete = () => charm.scale(decorations[spriteName], 0.95, 0.95, 5)
            .onComplete = () => charm.scale(decorations[spriteName], 1, 1, 3);
    }
    animation(padName);
    animation(`${padName}_tmb`);
}
function hidePad(padNum) {
    decorations[`pad_${padNum}`].visible = false;
    decorations[`pad_${padNum}_chosen`].visible = false;
    decorations[`pad_${padNum}_pressed`].visible = false;
    decorations[`pad_${padNum}_ok`].visible = false;
    decorations[`pad_${padNum}_tmb`].visible = false;
}
function selectPad(padNum) {
    decorations[`pad_${padNum}`].visible = false;
    decorations[`pad_${padNum}_chosen`].visible = true;
    decorations[`pad_${padNum}_pressed`].visible = true;
    decorations[`pad_${padNum}_ok`].visible = true;
}
function unSelectPad(padNum) {
    decorations[`pad_${padNum}`].visible = true;
    decorations[`pad_${padNum}_chosen`].visible = false;
    decorations[`pad_${padNum}_pressed`].visible = false;
    decorations[`pad_${padNum}_ok`].visible = false;
}

function selectStair(num) {
    let animation = function(sprite, step) {
        let endPosition = sprite.y;
        sprite.y -= step;
        sprite.visible = true;
        sprite.alpha = 0;
        charm.slide(sprite, sprite.x, endPosition, 20, "deceleration");
        charm.fadeIn(sprite, 15);
    }
    decorations.stair_old.visible = false;
    itemGroups[`stair_${num}`].visible = true;
    animation(decorations[`stair_${num}`], 50);
    setTimeout(() => animation(decorations[`stair_holders_${num}`], 100), 200);
    setTimeout(() => animation(decorations[`stair_carpet_${num}`], 100), 400);
}
function unSelectStair(num) {
    itemGroups[`stair_${num}`].visible = false;
    decorations[`stair_${num}`].visible = false;
    decorations[`stair_carpet_${num}`].visible = false;
    decorations[`stair_holders_${num}`].visible = false;
}

function activateMenu() {
    padAppear("pad_1");
    setTimeout(() => padAppear("pad_2"), 200);
    setTimeout(() => padAppear("pad_3"), 400);
}

function onHammerDown(eventData) {
    activateMenu();
    hammerHide();
}

function onPadDown(num) {
    if (selectedPadNumber) {
        unSelectPad(selectedPadNumber);
        unSelectStair(selectedPadNumber);
    }
    selectedPadNumber = num;
    selectPad(num);
    selectStair(num);
}

function onMenuDown() {
    for (let i = 1; i <= 3; i++) {
        hidePad(i);
    }
    decorations.final_back.visible = true;
    decorations.final_back.alpha = 0;
    charm.fadeIn(decorations.final_back, 15);
    decorations.final.visible = true;
    decorations.final.alpha = true;
    charm.fadeIn(decorations.final, 15);
}
