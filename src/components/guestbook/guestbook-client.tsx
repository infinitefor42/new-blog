"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiSend, FiEdit3, FiRefreshCw, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import {
  TbStar, TbHeart, TbCloud, TbFlower, TbSparkles, TbMoon, TbSun, TbBolt,
  TbSnowflake, TbLeaf, TbButterfly, TbCat, TbDog, TbFish, TbBug, TbMushroom,
  TbCherry, TbApple, TbCarrot, TbPizza, TbCoffee, TbBeer, TbCake, TbCandy,
  TbIceCream, TbIceCream2, TbRocket, TbUfo, TbPlanet, TbComet, TbRainbow,
  TbUmbrella, TbBalloon, TbGift, TbCrown, TbDiamond, TbKey, TbBell,
  TbBookmark, TbFlag, TbTrophy, TbMedal, TbMusic, TbHeadphones, TbCamera,
  TbPalette, TbBrush, TbPencil, TbBook, TbChess, TbDice, TbPuzzle,
  TbBallFootball, TbBallBasketball, TbBallTennis, TbBallVolleyball, TbBike,
  TbCar, TbPlane, TbSailboat, TbAnchor, TbMountain, TbTree, TbCactus,
  TbFlame, TbDroplet, TbWind, TbGhost, TbRobot, TbAlien, TbMoodSmile,
  TbMoodHappy, TbHeartHandshake, TbFeather, TbCookie, TbLollipop, TbCup,
  TbTeapot, TbPin, TbMapPin, TbCompass, TbGlobe, TbWorld, TbMoon2,
  TbSunHigh, TbCloudRain, TbCloudSnow, TbAbacus, TbAmbulance, TbAntenna,
  TbAtom, TbAxe, TbBackpack, TbBallAmericanFootball, TbBattery, TbBlocks,
  TbBriefcase, TbBuilding, TbBulb, TbBurger, TbBus, TbCalculator, TbCamper,
  TbCandle, TbCaravan, TbCircle, TbCloudStorm, TbClover, TbConfetti, TbDna,
  TbDrone, TbEgg, TbFiretruck, TbHammer, TbHelicopter, TbHelmet, TbHexagon,
  TbHome, TbLamp, TbLetterA, TbLifebuoy, TbMagnet, TbMailbox, TbMask,
  TbMessageCircle, TbMessages, TbMeteor, TbMicroscope, TbMilk, TbMoonStars,
  TbMoped, TbOctagon, TbPaw, TbPeace, TbPerfume, TbPhone, TbPill, TbPlug,
  TbQuote, TbRadio, TbRuler, TbSalad, TbSatellite, TbScissors, TbScooter,
  TbSeedling, TbShield, TbShip, TbShirt, TbShoe, TbSignature, TbSkateboard,
  TbSnowman, TbSquare, TbStars, TbStethoscope, TbSubmarine, TbSunset,
  TbSunset2, TbSword, TbTelescope, TbTent, TbTheater, TbThumbUp, TbTool,
  TbTools, TbTower, TbTractor, TbTrain, TbTriangle, TbTruck, TbUmbrella2,
  TbVirus, TbWheelchair, TbWriting,
} from "react-icons/tb";
import {
  fetchMessages,
  insertMessage,
  updateLikeCount,
  isSupabaseConfigured,
  type GuestbookMessage,
} from "@/lib/supabase";

/** 便签配色：纸张浅色 + 暗色模式各自适配（类名需完整字面量以被 Tailwind 扫描） */
const NOTE_COLORS: Record<
  string,
  { label: string; card: string; dot: string }
> = {
  yellow: {
    label: "暖黄",
    card: "bg-[#FFF3C4] border-[#E8D48B] dark:bg-[#4d421f] dark:border-[#8a7433]",
    dot: "bg-[#F0C930]",
  },
  pink: {
    label: "樱粉",
    card: "bg-[#FFDDDC] border-[#EFB3B0] dark:bg-[#4e2a28] dark:border-[#8a4c46]",
    dot: "bg-[#F19490]",
  },
  blue: {
    label: "浅蓝",
    card: "bg-[#D9EBFD] border-[#AECDEF] dark:bg-[#24344d] dark:border-[#3f5c85]",
    dot: "bg-[#6BA3E0]",
  },
  green: {
    label: "豆绿",
    card: "bg-[#DCF2D9] border-[#B2DCA9] dark:bg-[#2a4229] dark:border-[#4c7a48]",
    dot: "bg-[#7CBF6F]",
  },
  purple: {
    label: "黛紫",
    card: "bg-[#EBDFFB] border-[#CDB8EC] dark:bg-[#382e4e] dark:border-[#63518a]",
    dot: "bg-[#A986D9]",
  },
  orange: {
    label: "蜜橙",
    card: "bg-[#FFE4C7] border-[#F0C08F] dark:bg-[#4d351c] dark:border-[#8a6132]",
    dot: "bg-[#F5A83C]",
  },
  teal: {
    label: "青碧",
    card: "bg-[#CDF0EA] border-[#A3DCD2] dark:bg-[#1f4340] dark:border-[#37736c]",
    dot: "bg-[#4EC4B4]",
  },
  rose: {
    label: "蔷薇",
    card: "bg-[#FBDCE7] border-[#F0B4C9] dark:bg-[#4d2433] dark:border-[#8a4360]",
    dot: "bg-[#EC7FA5]",
  },
  slate: {
    label: "月灰",
    card: "bg-[#E4E2DC] border-[#C4C1B8] dark:bg-[#3b3a35] dark:border-[#66625a]",
    dot: "bg-[#9B968C]",
  },
};

const COLOR_KEYS = Object.keys(NOTE_COLORS);

/** 便签随机微旋转角度（按索引确定性取值，避免 hydration 不一致） */
const ROTATIONS = [-1.5, 1.2, -0.8, 1.8, -2, 0.6, -1.1, 1.5];

/**
 * 可选图案标识（用户头像）：发表留言时自主选择，随留言存入数据库，
 * 每条留言的图案永久固定，不随列表长度 / 排序变化。
 */
const AVATAR_OPTIONS = [
  { key: "star", Icon: TbStar, label: "星星" },
  { key: "heart", Icon: TbHeart, label: "爱心" },
  { key: "cloud", Icon: TbCloud, label: "云朵" },
  { key: "flower", Icon: TbFlower, label: "花朵" },
  { key: "sparkles", Icon: TbSparkles, label: "闪烁" },
  { key: "moon", Icon: TbMoon, label: "月亮" },
  { key: "sun", Icon: TbSun, label: "太阳" },
  { key: "bolt", Icon: TbBolt, label: "闪电" },
  { key: "snowflake", Icon: TbSnowflake, label: "雪花" },
  { key: "leaf", Icon: TbLeaf, label: "叶子" },
  { key: "butterfly", Icon: TbButterfly, label: "蝴蝶" },
  { key: "cat", Icon: TbCat, label: "猫咪" },
  { key: "dog", Icon: TbDog, label: "小狗" },
  { key: "fish", Icon: TbFish, label: "小鱼" },
  { key: "bug", Icon: TbBug, label: "瓢虫" },
  { key: "mushroom", Icon: TbMushroom, label: "蘑菇" },
  { key: "cherry", Icon: TbCherry, label: "樱桃" },
  { key: "apple", Icon: TbApple, label: "苹果" },
  { key: "carrot", Icon: TbCarrot, label: "胡萝卜" },
  { key: "pizza", Icon: TbPizza, label: "披萨" },
  { key: "coffee", Icon: TbCoffee, label: "咖啡" },
  { key: "beer", Icon: TbBeer, label: "啤酒" },
  { key: "cake", Icon: TbCake, label: "蛋糕" },
  { key: "candy", Icon: TbCandy, label: "糖果" },
  { key: "icecream", Icon: TbIceCream, label: "冰淇淋" },
  { key: "cone", Icon: TbIceCream2, label: "甜筒" },
  { key: "rocket", Icon: TbRocket, label: "火箭" },
  { key: "ufo", Icon: TbUfo, label: "飞碟" },
  { key: "planet", Icon: TbPlanet, label: "星球" },
  { key: "comet", Icon: TbComet, label: "彗星" },
  { key: "rainbow", Icon: TbRainbow, label: "彩虹" },
  { key: "umbrella", Icon: TbUmbrella, label: "雨伞" },
  { key: "balloon", Icon: TbBalloon, label: "气球" },
  { key: "gift", Icon: TbGift, label: "礼物" },
  { key: "crown", Icon: TbCrown, label: "皇冠" },
  { key: "diamond", Icon: TbDiamond, label: "钻石" },
  { key: "key", Icon: TbKey, label: "钥匙" },
  { key: "bell", Icon: TbBell, label: "铃铛" },
  { key: "bookmark", Icon: TbBookmark, label: "书签" },
  { key: "flag", Icon: TbFlag, label: "旗帜" },
  { key: "trophy", Icon: TbTrophy, label: "奖杯" },
  { key: "medal", Icon: TbMedal, label: "奖牌" },
  { key: "music", Icon: TbMusic, label: "音乐" },
  { key: "headphones", Icon: TbHeadphones, label: "耳机" },
  { key: "camera", Icon: TbCamera, label: "相机" },
  { key: "palette", Icon: TbPalette, label: "调色板" },
  { key: "brush", Icon: TbBrush, label: "画笔" },
  { key: "pencil", Icon: TbPencil, label: "铅笔" },
  { key: "book", Icon: TbBook, label: "书本" },
  { key: "chess", Icon: TbChess, label: "象棋" },
  { key: "dice", Icon: TbDice, label: "骰子" },
  { key: "puzzle", Icon: TbPuzzle, label: "拼图" },
  { key: "football", Icon: TbBallFootball, label: "足球" },
  { key: "basketball", Icon: TbBallBasketball, label: "篮球" },
  { key: "tennis", Icon: TbBallTennis, label: "网球" },
  { key: "volleyball", Icon: TbBallVolleyball, label: "排球" },
  { key: "bike", Icon: TbBike, label: "单车" },
  { key: "car", Icon: TbCar, label: "汽车" },
  { key: "plane", Icon: TbPlane, label: "飞机" },
  { key: "sailboat", Icon: TbSailboat, label: "帆船" },
  { key: "anchor", Icon: TbAnchor, label: "船锚" },
  { key: "mountain", Icon: TbMountain, label: "山峰" },
  { key: "tree", Icon: TbTree, label: "树木" },
  { key: "cactus", Icon: TbCactus, label: "仙人掌" },
  { key: "flame", Icon: TbFlame, label: "火焰" },
  { key: "droplet", Icon: TbDroplet, label: "水滴" },
  { key: "wind", Icon: TbWind, label: "微风" },
  { key: "ghost", Icon: TbGhost, label: "幽灵" },
  { key: "robot", Icon: TbRobot, label: "机器人" },
  { key: "alien", Icon: TbAlien, label: "外星人" },
  { key: "smile", Icon: TbMoodSmile, label: "微笑" },
  { key: "happy", Icon: TbMoodHappy, label: "开心" },
  { key: "handshake", Icon: TbHeartHandshake, label: "比心" },
  { key: "feather", Icon: TbFeather, label: "羽毛" },
  { key: "cookie", Icon: TbCookie, label: "曲奇" },
  { key: "lollipop", Icon: TbLollipop, label: "棒棒糖" },
  { key: "cup", Icon: TbCup, label: "杯子" },
  { key: "teapot", Icon: TbTeapot, label: "茶壶" },
  { key: "pin", Icon: TbPin, label: "图钉" },
  { key: "mappin", Icon: TbMapPin, label: "定位" },
  { key: "compass", Icon: TbCompass, label: "指南针" },
  { key: "globe", Icon: TbGlobe, label: "地球仪" },
  { key: "world", Icon: TbWorld, label: "世界" },
  { key: "moon2", Icon: TbMoon2, label: "弯月" },
  { key: "sunhigh", Icon: TbSunHigh, label: "骄阳" },
  { key: "rain", Icon: TbCloudRain, label: "下雨" },
  { key: "snow", Icon: TbCloudSnow, label: "下雪" },
  { key: "abacus", Icon: TbAbacus, label: "算盘" },
  { key: "ambulance", Icon: TbAmbulance, label: "救护车" },
  { key: "antenna", Icon: TbAntenna, label: "天线" },
  { key: "atom", Icon: TbAtom, label: "原子" },
  { key: "axe", Icon: TbAxe, label: "斧头" },
  { key: "backpack", Icon: TbBackpack, label: "背包" },
  { key: "rugby", Icon: TbBallAmericanFootball, label: "橄榄球" },
  { key: "battery", Icon: TbBattery, label: "电池" },
  { key: "blocks", Icon: TbBlocks, label: "积木" },
  { key: "briefcase", Icon: TbBriefcase, label: "公文包" },
  { key: "building", Icon: TbBuilding, label: "大楼" },
  { key: "bulb", Icon: TbBulb, label: "灯泡" },
  { key: "burger", Icon: TbBurger, label: "汉堡" },
  { key: "bus", Icon: TbBus, label: "巴士" },
  { key: "calculator", Icon: TbCalculator, label: "计算器" },
  { key: "camper", Icon: TbCamper, label: "房车" },
  { key: "candle", Icon: TbCandle, label: "蜡烛" },
  { key: "caravan", Icon: TbCaravan, label: "大篷车" },
  { key: "circle", Icon: TbCircle, label: "圆圈" },
  { key: "storm", Icon: TbCloudStorm, label: "暴风雨" },
  { key: "clover", Icon: TbClover, label: "三叶草" },
  { key: "confetti", Icon: TbConfetti, label: "彩带" },
  { key: "dna", Icon: TbDna, label: "DNA" },
  { key: "drone", Icon: TbDrone, label: "无人机" },
  { key: "egg", Icon: TbEgg, label: "鸡蛋" },
  { key: "firetruck", Icon: TbFiretruck, label: "消防车" },
  { key: "hammer", Icon: TbHammer, label: "锤子" },
  { key: "helicopter", Icon: TbHelicopter, label: "直升机" },
  { key: "helmet", Icon: TbHelmet, label: "头盔" },
  { key: "hexagon", Icon: TbHexagon, label: "六边形" },
  { key: "home", Icon: TbHome, label: "小屋" },
  { key: "lamp", Icon: TbLamp, label: "台灯" },
  { key: "lettera", Icon: TbLetterA, label: "字母A" },
  { key: "lifebuoy", Icon: TbLifebuoy, label: "救生圈" },
  { key: "magnet", Icon: TbMagnet, label: "磁铁" },
  { key: "mailbox", Icon: TbMailbox, label: "信箱" },
  { key: "mask", Icon: TbMask, label: "面具" },
  { key: "message", Icon: TbMessageCircle, label: "对话" },
  { key: "messages", Icon: TbMessages, label: "消息" },
  { key: "meteor", Icon: TbMeteor, label: "流星" },
  { key: "microscope", Icon: TbMicroscope, label: "显微镜" },
  { key: "milk", Icon: TbMilk, label: "牛奶" },
  { key: "moonstars", Icon: TbMoonStars, label: "星月" },
  { key: "moped", Icon: TbMoped, label: "小摩托" },
  { key: "octagon", Icon: TbOctagon, label: "八边形" },
  { key: "paw", Icon: TbPaw, label: "爪印" },
  { key: "peace", Icon: TbPeace, label: "和平" },
  { key: "perfume", Icon: TbPerfume, label: "香水" },
  { key: "phone", Icon: TbPhone, label: "电话" },
  { key: "pill", Icon: TbPill, label: "药丸" },
  { key: "plug", Icon: TbPlug, label: "插头" },
  { key: "quote", Icon: TbQuote, label: "引号" },
  { key: "radio", Icon: TbRadio, label: "收音机" },
  { key: "ruler", Icon: TbRuler, label: "尺子" },
  { key: "salad", Icon: TbSalad, label: "沙拉" },
  { key: "satellite", Icon: TbSatellite, label: "卫星" },
  { key: "scissors", Icon: TbScissors, label: "剪刀" },
  { key: "scooter", Icon: TbScooter, label: "滑板车" },
  { key: "seedling", Icon: TbSeedling, label: "幼苗" },
  { key: "shield", Icon: TbShield, label: "盾牌" },
  { key: "ship", Icon: TbShip, label: "轮船" },
  { key: "shirt", Icon: TbShirt, label: "T恤" },
  { key: "shoe", Icon: TbShoe, label: "鞋子" },
  { key: "signature", Icon: TbSignature, label: "签名" },
  { key: "skateboard", Icon: TbSkateboard, label: "滑板" },
  { key: "snowman", Icon: TbSnowman, label: "雪人" },
  { key: "square", Icon: TbSquare, label: "方块" },
  { key: "stars", Icon: TbStars, label: "群星" },
  { key: "stethoscope", Icon: TbStethoscope, label: "听诊器" },
  { key: "submarine", Icon: TbSubmarine, label: "潜水艇" },
  { key: "sunset", Icon: TbSunset, label: "日落" },
  { key: "sunset2", Icon: TbSunset2, label: "夕阳" },
  { key: "sword", Icon: TbSword, label: "宝剑" },
  { key: "telescope", Icon: TbTelescope, label: "望远镜" },
  { key: "tent", Icon: TbTent, label: "帐篷" },
  { key: "theater", Icon: TbTheater, label: "剧院" },
  { key: "thumbup", Icon: TbThumbUp, label: "点赞" },
  { key: "tool", Icon: TbTool, label: "工具" },
  { key: "tools", Icon: TbTools, label: "工具箱" },
  { key: "tower", Icon: TbTower, label: "高塔" },
  { key: "tractor", Icon: TbTractor, label: "拖拉机" },
  { key: "train", Icon: TbTrain, label: "火车" },
  { key: "triangle", Icon: TbTriangle, label: "三角" },
  { key: "truck", Icon: TbTruck, label: "卡车" },
  { key: "umbrella2", Icon: TbUmbrella2, label: "阳伞" },
  { key: "virus", Icon: TbVirus, label: "病毒" },
  { key: "wheelchair", Icon: TbWheelchair, label: "轮椅" },
  { key: "writing", Icon: TbWriting, label: "手写" },
] as const;

/**
 * 每个图案的语义化配色（柔和中调色系，明暗主题下均协调）。
 * 类名需完整字面量以被 Tailwind 扫描。
 */
const AVATAR_COLORS: Record<string, string> = {
  star: "text-amber-400", heart: "text-rose-400", cloud: "text-sky-400",
  flower: "text-pink-400", sparkles: "text-violet-400", moon: "text-indigo-400",
  sun: "text-amber-500", bolt: "text-yellow-500", snowflake: "text-cyan-400",
  leaf: "text-green-500", butterfly: "text-fuchsia-400", cat: "text-orange-400",
  dog: "text-amber-500", fish: "text-sky-500", bug: "text-red-400",
  mushroom: "text-orange-300", cherry: "text-rose-500", apple: "text-red-500",
  carrot: "text-orange-500", pizza: "text-yellow-500", coffee: "text-amber-600",
  beer: "text-yellow-400", cake: "text-pink-300", candy: "text-fuchsia-300",
  icecream: "text-pink-400", cone: "text-amber-400", rocket: "text-red-400",
  ufo: "text-purple-400", planet: "text-indigo-400", comet: "text-sky-300",
  rainbow: "text-teal-400", umbrella: "text-blue-400", balloon: "text-red-300",
  gift: "text-rose-400", crown: "text-yellow-500", diamond: "text-cyan-300",
  key: "text-amber-500", bell: "text-yellow-400", bookmark: "text-blue-400",
  flag: "text-red-500", trophy: "text-amber-500", medal: "text-yellow-500",
  music: "text-violet-500", headphones: "text-indigo-500", camera: "text-stone-500",
  palette: "text-rose-400", brush: "text-orange-400", pencil: "text-amber-600",
  book: "text-blue-500", chess: "text-stone-500", dice: "text-stone-400",
  puzzle: "text-green-400", football: "text-emerald-500", basketball: "text-orange-500",
  tennis: "text-lime-500", volleyball: "text-sky-400", bike: "text-blue-500",
  car: "text-red-500", plane: "text-sky-500", sailboat: "text-cyan-500",
  anchor: "text-stone-500", mountain: "text-emerald-600", tree: "text-green-600",
  cactus: "text-green-500", flame: "text-orange-500", droplet: "text-blue-400",
  wind: "text-teal-300", ghost: "text-stone-400", robot: "text-stone-500",
  alien: "text-green-400", smile: "text-yellow-400", happy: "text-amber-400",
  handshake: "text-rose-400", feather: "text-stone-400", cookie: "text-amber-600",
  lollipop: "text-pink-400", cup: "text-sky-400", teapot: "text-teal-500",
  pin: "text-red-400", mappin: "text-rose-500", compass: "text-red-500",
  globe: "text-blue-500", world: "text-teal-500", moon2: "text-indigo-300",
  sunhigh: "text-amber-500", rain: "text-blue-400", snow: "text-cyan-300",
  abacus: "text-amber-600", ambulance: "text-red-400", antenna: "text-stone-500",
  atom: "text-violet-500", axe: "text-stone-500", backpack: "text-orange-400",
  rugby: "text-amber-600", battery: "text-green-500", blocks: "text-blue-400",
  briefcase: "text-amber-600", building: "text-stone-400", bulb: "text-yellow-400",
  burger: "text-amber-500", bus: "text-yellow-500", calculator: "text-stone-500",
  camper: "text-teal-400", candle: "text-orange-300", caravan: "text-orange-400",
  circle: "text-blue-400", storm: "text-indigo-500", clover: "text-green-500",
  confetti: "text-pink-400", dna: "text-teal-500", drone: "text-stone-500",
  egg: "text-amber-300", firetruck: "text-red-500", hammer: "text-stone-500",
  helicopter: "text-sky-500", helmet: "text-orange-500", hexagon: "text-violet-400",
  home: "text-amber-500", lamp: "text-yellow-400", lettera: "text-blue-500",
  lifebuoy: "text-red-400", magnet: "text-red-500", mailbox: "text-blue-500",
  mask: "text-purple-400", message: "text-green-500", messages: "text-teal-500",
  meteor: "text-orange-400", microscope: "text-stone-500", milk: "text-sky-300",
  moonstars: "text-indigo-400", moped: "text-teal-500", octagon: "text-rose-400",
  paw: "text-amber-500", peace: "text-green-400", perfume: "text-pink-300",
  phone: "text-green-500", pill: "text-rose-400", plug: "text-amber-500",
  quote: "text-stone-400", radio: "text-orange-400", ruler: "text-amber-500",
  salad: "text-green-500", satellite: "text-stone-500", scissors: "text-stone-500",
  scooter: "text-red-400", seedling: "text-green-400", shield: "text-blue-500",
  ship: "text-blue-500", shirt: "text-sky-400", shoe: "text-orange-400",
  signature: "text-indigo-500", skateboard: "text-violet-500", snowman: "text-sky-300",
  square: "text-teal-400", stars: "text-yellow-400", stethoscope: "text-red-400",
  submarine: "text-yellow-500", sunset: "text-orange-500", sunset2: "text-rose-400",
  sword: "text-stone-500", telescope: "text-indigo-500", tent: "text-orange-400",
  theater: "text-red-400", thumbup: "text-blue-500", tool: "text-stone-500",
  tools: "text-amber-600", tower: "text-stone-400", tractor: "text-green-600",
  train: "text-blue-500", triangle: "text-amber-400", truck: "text-blue-400",
  umbrella2: "text-violet-400", virus: "text-green-500", wheelchair: "text-blue-500",
  writing: "text-stone-500",
};

/** key → 图标组件 索引表，未知 key 回退到星星 */
const AVATAR_MAP: Record<string, (typeof AVATAR_OPTIONS)[number]["Icon"]> =
  Object.fromEntries(AVATAR_OPTIONS.map((o) => [o.key, o.Icon]));

const DEFAULT_AVATAR = "star";

const MAX_LENGTH = 500;
const PAGE_SIZE = 30;

/** 反垃圾：同一设备两次提交的最小间隔（秒） */
const RATE_LIMIT_SECONDS = 60;
const RATE_LIMIT_KEY = "guestbook_last_submit";

/** 本设备已点赞的留言 id 列表 */
const LIKED_KEY = "guestbook_liked";

/** 草稿暂存键：输入中的昵称 / 正文 / 配色 */
const DRAFT_KEY = "guestbook_draft";

type Draft = { nickname: string; content: string; color: string; avatar: string };

const EMPTY_DRAFT: Draft = {
  nickname: "",
  content: "",
  color: "yellow",
  avatar: DEFAULT_AVATAR,
};

function readDraft(): Draft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return EMPTY_DRAFT;
    const draft = JSON.parse(raw) as Partial<Draft>;
    return {
      nickname: typeof draft.nickname === "string" ? draft.nickname.slice(0, 20) : "",
      content:
        typeof draft.content === "string" ? draft.content.slice(0, MAX_LENGTH) : "",
      color:
        typeof draft.color === "string" && NOTE_COLORS[draft.color]
          ? draft.color
          : "yellow",
      avatar:
        typeof draft.avatar === "string" && AVATAR_MAP[draft.avatar]
          ? draft.avatar
          : DEFAULT_AVATAR,
    };
  } catch {
    return EMPTY_DRAFT;
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* 隐私模式忽略 */
  }
}

function readLikedIds(): number[] {
  try {
    const raw = JSON.parse(localStorage.getItem(LIKED_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((x) => Number.isInteger(x)) : [];
  } catch {
    return [];
  }
}

/** 客户端敏感词表：命中即拒绝提交（低成本拦截广告机） */
const BLOCKED_WORDS = [
  "加微信", "兼职", "刷单", "代购", "赌场", "博彩", "代开发票",
  "免费领取", "点击链接", "加qq", "casino", "viagra", "airdrop",
];

/** 链接数量上限：超过即拒绝 */
const MAX_LINKS = 2;

function countLinks(text: string) {
  return (text.match(/https?:\/\/|www\./gi) ?? []).length;
}

function containsBlockedWord(text: string) {
  const lower = text.toLowerCase();
  return BLOCKED_WORDS.some((w) => lower.includes(w.toLowerCase()));
}

function StickyNote({
  message,
  index,
  liked,
  onToggleLike,
}: {
  message: GuestbookMessage;
  index: number;
  liked: boolean;
  onToggleLike: (message: GuestbookMessage) => void;
}) {
  const color = NOTE_COLORS[message.color] ?? NOTE_COLORS.yellow;
  const rotation = ROTATIONS[index % ROTATIONS.length];
  // ① 图钉 / 胶带混排：奇数索引用图钉，偶数保留胶带，增加随机感
  const usePin = index % 2 === 1;
  // ② 用户自主选择的图案标识（头像），随留言入库、永久固定
  const AvatarIcon = AVATAR_MAP[message.avatar] ?? AVATAR_MAP[DEFAULT_AVATAR];

  return (
    // 外层包裹：透明的 pt-2 把图钉/胶带收进多列子项的盒模型内，
    // 避免负值绝对定位元素溢出列边界被 Chrome 分片裁剪后“幽灵绘制”到前一列
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      whileHover={{ rotate: 0, scale: 1.03, zIndex: 10 }}
      className="relative mb-5 break-inside-avoid pt-2"
    >
      {/* 顶部固定件：图钉与胶带混用（定位均相对于外层，视觉上仍压在卡片上沿） */}
      {usePin ? (
        <div className={`absolute left-1/2 top-0.5 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full ${color.dot} shadow-[0_1px_2px_rgba(0,0,0,0.25)]`}>
          <div className="absolute left-1 top-1 h-1 w-1 rounded-full bg-white/60" />
        </div>
      ) : (
        <div className="absolute left-1/2 top-0 z-10 h-5 w-16 -translate-x-1/2 -rotate-2 rounded-sm bg-ink-black/10 dark:bg-rice-white/20" />
      )}
      <div className={`rounded-md border p-4 pt-5 shadow-md shadow-black/5 dark:shadow-black/30 ${color.card}`}>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-black/85 dark:text-rice-white/90">
          {message.content}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-ink-black/10 pt-2 dark:border-rice-white/15">
          <span className="flex min-w-0 items-center gap-1.5">
            {/* 用户图案标识（头像）徽章：浅色底托 + 图案自身配色 */}
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/70 dark:bg-rice-white/15"
            >
              <AvatarIcon
                className={`h-3 w-3 ${AVATAR_COLORS[message.avatar] ?? "text-stone-400"}`}
              />
            </span>
            <span className="truncate text-xs font-medium text-ink-black/60 dark:text-rice-white-dim">
              {message.nickname}
            </span>
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onToggleLike(message)}
              aria-label={liked ? "取消点赞" : "点赞"}
              className={`flex items-center gap-1 text-xs transition-all hover:scale-110 ${
                liked
                  ? "text-[#E2607F]"
                  : "text-ink-black/40 hover:text-[#E2607F] dark:text-rice-white-dim/70"
              }`}
            >
              {liked ? (
                <FaHeart className="h-3.5 w-3.5" />
              ) : (
                <FiHeart className="h-3.5 w-3.5" />
              )}
              <span>{message.like_count}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function GuestbookClient() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");

  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("yellow");
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitOk, setSubmitOk] = useState(false);
  // 蜜罐字段：正常用户不可见也不会填写，被填入即判定为机器人
  const [website, setWebsite] = useState("");
  // 本设备已点赞的留言 id
  const [likedIds, setLikedIds] = useState<number[]>([]);
  // 提交成功后抑制一次草稿写回，否则清空 content 的那次渲染会把草稿又写回去
  const skipDraftWrite = useRef(false);
  // 草稿是否已从 localStorage 恢复过（防止恢复前的初始空值把草稿覆盖掉）
  const draftRestored = useRef(false);

  // 图案选择器滚动状态：驱动上下渐隐遮罩与右侧迷你进度条
  const pickerRef = useRef<HTMLDivElement>(null);
  const [pickerScroll, setPickerScroll] = useState({
    canUp: false,
    canDown: true,
    progress: 0,
    thumbRatio: 0.2,
  });
  const handlePickerScroll = () => {
    const el = pickerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const max = scrollHeight - clientHeight;
    setPickerScroll({
      canUp: scrollTop > 4,
      canDown: scrollTop < max - 4,
      progress: max > 0 ? scrollTop / max : 0,
      thumbRatio: scrollHeight > 0 ? clientHeight / scrollHeight : 1,
    });
  };

  // 逐行滚动：浏览器原生滚轮一格约滚 100~120px（≈3~4 行），
  // 这里拦截 wheel 事件，把每格折算为恰好一行（36px），平滑归位；
  // 触控板微小连续增量先累加，满 50px 阈值才滚一行，避免过敏。
  // 需非 passive 监听才能 preventDefault，故用原生 addEventListener。
  const wheelAccRef = useRef(0);
  useEffect(() => {
    const el = pickerRef.current;
    if (!el) return;
    const ROW_HEIGHT = 36; // h-8 (32px) + gap-1 (4px)
    const TOUCHPAD_THRESHOLD = 50;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Firefox 按"行"上报（deltaMode=1），折算成像素
      const delta = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;
      let rows = 0;
      if (Math.abs(delta) >= TOUCHPAD_THRESHOLD) {
        // 鼠标滚轮：一格 = 一行，与滚动量大小无关
        rows = Math.sign(delta);
        wheelAccRef.current = 0;
      } else {
        // 触控板：累加微增量，满阈值滚一行
        wheelAccRef.current += delta;
        rows = Math.trunc(wheelAccRef.current / TOUCHPAD_THRESHOLD);
        wheelAccRef.current -= rows * TOUCHPAD_THRESHOLD;
      }
      if (rows !== 0) {
        el.scrollBy({ top: rows * ROW_HEIGHT, behavior: "smooth" });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // 挂载后恢复草稿 + 点赞记录。
  // localStorage 只在浏览器存在，无法用于 state 初始化（会导致 SSR/hydration 不一致），
  // 因此挂载后同步一次。首帧不渲染输入值，用户无感知。
  useEffect(() => {
    const draft = readDraft();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 挂载时从 localStorage 同步一次，属外部系统读取
    setNickname(draft.nickname);
    setContent(draft.content);
    setColor(draft.color);
    setAvatar(draft.avatar);
    setLikedIds(readLikedIds());
    draftRestored.current = true;
  }, []);

  // 输入变化时写入草稿：空内容则清除，避免留下空壳
  useEffect(() => {
    if (!draftRestored.current) return;
    if (skipDraftWrite.current) {
      skipDraftWrite.current = false;
      return;
    }
    try {
      const isEmpty =
        !nickname.trim() && !content.trim() && color === "yellow" && avatar === DEFAULT_AVATAR;
      if (isEmpty) {
        localStorage.removeItem(DRAFT_KEY);
      } else {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ nickname, content, color, avatar })
        );
      }
    } catch {
      /* 隐私模式 / 配额超限忽略 */
    }
  }, [nickname, content, color, avatar]);

  // 已从服务端加载的条数（分页游标）。
  // 不能直接用 messages.length：本地新提交的留言会前插，导致游标错位、翻页重复或漏读。
  const loadedCountRef = useRef(0);
  // 加载更多请求去重，防止快速连点造成并发重复拉取
  const loadingMoreRef = useRef(false);

  const loadMessages = useCallback(async (from: number) => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    if (from === 0) {
      setLoading(true);
    } else {
      if (loadingMoreRef.current) return;
      loadingMoreRef.current = true;
      setLoadingMore(true);
    }
    setLoadError("");

    const { data, error } = await fetchMessages(from, PAGE_SIZE);
    if (error) {
      setLoadError(error);
    } else if (data) {
      setMessages((prev) => (from === 0 ? data : [...prev, ...data]));
      setHasMore(data.length === PAGE_SIZE);
      // 游标只统计服务端返回的条数，不受本地新提交影响
      loadedCountRef.current = from === 0 ? data.length : loadedCountRef.current + data.length;
    }
    setLoading(false);
    loadingMoreRef.current = false;
    setLoadingMore(false);
  }, []);

  // 首次挂载拉取第一页（loadMessages 内部首行会同步 setLoading）
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 首次加载数据，需立即可见 loading 态
    void loadMessages(0);
  }, [loadMessages]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter(
      (m) =>
        m.content.toLowerCase().includes(q) ||
        m.nickname.toLowerCase().includes(q)
    );
  }, [messages, query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // 蜜罐触发：静默丢弃并伪装成功，不给机器人任何反馈信号
    if (website) {
      skipDraftWrite.current = true;
      clearDraft();
      setContent("");
      setSubmitOk(true);
      setTimeout(() => setSubmitOk(false), 3000);
      return;
    }

    // 客户端限流：同一设备 60 秒内只能提交一条
    const lastSubmit = parseInt(localStorage.getItem(RATE_LIMIT_KEY) || "0");
    const waitMs = RATE_LIMIT_SECONDS * 1000 - (Date.now() - lastSubmit);
    if (waitMs > 0) {
      setSubmitError(`发送太频繁啦，请 ${Math.ceil(waitMs / 1000)} 秒后再试`);
      return;
    }

    const trimmed = content.trim();
    if (!trimmed) {
      setSubmitError("写点什么再贴上去吧");
      return;
    }
    if (trimmed.length > MAX_LENGTH) {
      setSubmitError(`最多 ${MAX_LENGTH} 字`);
      return;
    }
    // 内容过滤：敏感词 + 链接数量
    if (containsBlockedWord(trimmed)) {
      setSubmitError("留言包含不适合发布的内容，请修改后再试");
      return;
    }
    if (countLinks(trimmed) > MAX_LINKS) {
      setSubmitError(`留言中最多包含 ${MAX_LINKS} 个链接`);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setSubmitOk(false);

    const { data, error } = await insertMessage({
      nickname: nickname.trim() || "匿名",
      content: trimmed,
      color,
      avatar,
    });

    setSubmitting(false);
    if (error) {
      setSubmitError(error);
      return;
    }
    if (data) {
      setMessages((prev) => [data, ...prev]);
    }
    localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
    // 已成功上墙，草稿使命完成：抑制写回 + 清空表单 + 删草稿
    skipDraftWrite.current = true;
    clearDraft();
    setContent("");
    setSubmitOk(true);
    setTimeout(() => setSubmitOk(false), 3000);
  };

  // 点赞 / 取消点赞：乐观更新，失败回滚
  const handleToggleLike = async (message: GuestbookMessage) => {
    const liked = likedIds.includes(message.id);
    const nextCount = Math.max(0, message.like_count + (liked ? -1 : 1));
    const nextLikedIds = liked
      ? likedIds.filter((x) => x !== message.id)
      : [...likedIds, message.id];

    // 乐观更新本地状态
    setLikedIds(nextLikedIds);
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, like_count: nextCount } : m))
    );
    try {
      localStorage.setItem(LIKED_KEY, JSON.stringify(nextLikedIds));
    } catch { /* 隐私模式忽略 */ }

    const { data, error } = await updateLikeCount(message.id, liked ? -1 : 1);
    if (error) {
      // 回滚
      setLikedIds(likedIds);
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, like_count: message.like_count } : m))
      );
      try {
        localStorage.setItem(LIKED_KEY, JSON.stringify(likedIds));
      } catch { /* 忽略 */ }
    } else if (data) {
      // 以服务器计数为准（多人并发点赞时保持准确）
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, like_count: data.like_count } : m))
      );
    }
  };

  const scrollToForm = () => {
    document
      .getElementById("guestbook-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="container mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28">
      {/* 页头 */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="font-song text-4xl font-bold tracking-wide text-ink-black dark:text-rice-white lg:text-5xl">
          留言墙
        </h1>
        <p className="mt-3 text-sm text-ink-gray dark:text-rice-white-dim lg:text-base">
          留下你的足迹，每一张便签都是一份温暖。
        </p>
      </motion.header>

      {/* 未配置 Supabase 的引导提示 */}
      {!isSupabaseConfigured && (
        <div className="glass-card mx-auto mb-10 max-w-xl p-5 text-sm leading-relaxed text-ink-gray dark:text-rice-white-dim">
          <p className="font-medium text-ink-black dark:text-rice-white">
            留言墙尚未连接数据库
          </p>
          <p className="mt-2">
            请在 <code className="rounded bg-ink-black/5 px-1 dark:bg-rice-white/10">.env.local</code> 中配置
            <code className="rounded bg-ink-black/5 px-1 dark:bg-rice-white/10"> NEXT_PUBLIC_SUPABASE_URL </code>
            和
            <code className="rounded bg-ink-black/5 px-1 dark:bg-rice-white/10"> NEXT_PUBLIC_SUPABASE_ANON_KEY </code>
            后重新构建。
          </p>
        </div>
      )}

      {/* 双栏布局：桌面端 左表单(sticky) + 右便签墙；移动端 便签墙在前、表单在后 */}
      <div className="flex flex-col lg:grid lg:grid-cols-[480px_1fr] lg:items-start lg:gap-8">
        {/* 便签墙栏（移动端 order-1 优先展示，桌面端位于右侧） */}
        <section aria-label="留言列表" className="order-1 min-w-0 lg:order-2">
          {/* 搜索栏 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card mb-6 flex items-center gap-3 px-4 py-3"
          >
            <FiSearch className="h-4 w-4 shrink-0 text-ink-gray dark:text-rice-white-dim" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索留言或昵称..."
              className="w-full bg-transparent text-sm text-ink-black outline-none placeholder:text-ink-gray/50 dark:text-rice-white dark:placeholder:text-rice-white-dim/50"
            />
          </motion.div>

          {/* 移动端写留言入口：一键滚动到底部表单 */}
          <button
            type="button"
            onClick={scrollToForm}
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl border border-ink-black/15 py-2.5 text-sm font-medium text-ink-black transition-colors hover:bg-ink-black/5 lg:hidden dark:border-rice-white/20 dark:text-rice-white dark:hover:bg-rice-white/10"
          >
            <FiEdit3 className="h-4 w-4" />
            写留言
          </button>

          {loading ? (
            <p className="py-16 text-center text-sm text-ink-gray dark:text-rice-white-dim">
              便签搬运中...
            </p>
          ) : loadError ? (
            <div className="py-16 text-center">
              <p className="text-sm text-accent-dark dark:text-accent-light">
                {loadError}
              </p>
              <button
                type="button"
                onClick={() => loadMessages(0)}
                className="mx-auto mt-4 flex items-center gap-2 rounded-xl border border-ink-black/15 px-5 py-2 text-sm text-ink-black transition-colors hover:bg-ink-black/5 dark:border-rice-white/20 dark:text-rice-white dark:hover:bg-rice-white/10"
              >
                <FiRefreshCw className="h-4 w-4" />
                重试
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-song text-lg text-ink-gray dark:text-rice-white-dim">
                {query ? "没有找到匹配的便签" : "这里还没有留言"}
              </p>
              <p className="mt-2 text-sm text-ink-gray/70 dark:text-rice-white-dim/70">
                {query ? "换个关键词试试" : "来写下第一张便签吧"}
              </p>
            </div>
          ) : (
            <>
              <div className="columns-1 gap-5 pt-3 sm:columns-2 xl:columns-3">
                {filtered.map((m, i) => (
                  <StickyNote
                    key={m.id}
                    message={m}
                    index={i}
                    liked={likedIds.includes(m.id)}
                    onToggleLike={handleToggleLike}
                  />
                ))}
              </div>

              {/* 分页：加载更多（搜索态下隐藏） */}
              {hasMore && !query.trim() && (
                <div className="mt-2 text-center">
                  <button
                    type="button"
                    onClick={() => loadMessages(loadedCountRef.current)}
                    disabled={loadingMore}
                    className="rounded-xl border border-ink-black/15 px-6 py-2.5 text-sm text-ink-black transition-colors hover:bg-ink-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rice-white/20 dark:text-rice-white dark:hover:bg-rice-white/10"
                  >
                    {loadingMore ? "加载中..." : "加载更多便签"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* 表单栏（移动端 order-2 沉底，桌面端位于左侧并 sticky 吸附） */}
        <motion.section
          id="guestbook-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="glass-card order-2 mt-10 scroll-mt-28 p-8 lg:order-1 lg:sticky lg:top-24 lg:mt-0"
        >
          <h2 className="flex items-center gap-2 font-song text-lg font-bold text-ink-black dark:text-rice-white">
            <FiEdit3 className="h-4 w-4" />
            留下一句话
          </h2>
          <p className="mb-4 mt-1 text-xs text-ink-gray/70 dark:text-rice-white-dim/70">
            <span className="hidden lg:inline">你的便签会贴在右边的墙上 →</span>
            <span className="lg:hidden">你的便签会贴在上方的墙上 ↑</span>
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 蜜罐：视觉隐藏 + 移出 Tab 序列，机器人会填，真人不会 */}
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              placeholder="请勿填写此项"
              className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
            />
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              placeholder="称呼（可选）"
              className="w-full rounded-xl border border-warm-gray-light bg-paper-bg-light/60 px-4 py-2.5 text-sm text-ink-black outline-none transition-colors placeholder:text-ink-gray/50 focus:border-accent dark:border-rice-white/10 dark:bg-ink-deep-light/60 dark:text-rice-white dark:placeholder:text-rice-white-dim/50"
            />
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                maxLength={MAX_LENGTH}
                placeholder="想说的话..."
                className="w-full resize-none rounded-xl border border-warm-gray-light bg-paper-bg-light/60 px-4 py-2.5 text-sm leading-relaxed text-ink-black outline-none transition-colors placeholder:text-ink-gray/50 focus:border-accent dark:border-rice-white/10 dark:bg-ink-deep-light/60 dark:text-rice-white dark:placeholder:text-rice-white-dim/50"
              />
              <div className="mt-1 text-right text-xs text-ink-gray/60 dark:text-rice-white-dim/60">
                {content.length}/{MAX_LENGTH}
              </div>
            </div>

            {/* 便签颜色选择 */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5">
              <span className="text-xs text-ink-gray dark:text-rice-white-dim">
                便签颜色
              </span>
              {COLOR_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-label={NOTE_COLORS[key].label}
                  title={NOTE_COLORS[key].label}
                  onClick={() => setColor(key)}
                  className={`h-7 w-7 rounded-full ${NOTE_COLORS[key].dot} transition-transform ${
                    color === key
                      ? "scale-110 ring-2 ring-ink-black/40 ring-offset-2 ring-offset-paper-bg dark:ring-rice-white/50 dark:ring-offset-ink-deep"
                      : "opacity-60 hover:scale-105 hover:opacity-100"
                  }`}
                />
              ))}
            </div>

            {/* 图案标识（头像）选择：随留言入库，永久固定 */}
            <div>
              <span className="text-xs text-ink-gray dark:text-rice-white-dim">
                图案标识
              </span>
              {/*
                滚动方案：惯性原生滚动 + proximity 软吸附（不抢控制权，靠近行边界才轻柔归位）
                + 上下渐隐遮罩（暗示对应方向还有内容）+ 右侧迷你进度条（位置感）。
                默认恰好展示 3 行（3×h-8 + 2×gap-1 + 上下 p-1 = 112px）。
              */}
              {(() => {
                const fadeTop = "transparent, black 16px";
                const fadeBottom = "black calc(100% - 16px), transparent";
                const maskImage =
                  pickerScroll.canUp && pickerScroll.canDown
                    ? `linear-gradient(to bottom, ${fadeTop}, ${fadeBottom})`
                    : pickerScroll.canUp
                      ? `linear-gradient(to bottom, ${fadeTop})`
                      : pickerScroll.canDown
                        ? `linear-gradient(to bottom, ${fadeBottom})`
                        : "none";
                return (
                  <div className="relative mt-2">
                    <div
                      ref={pickerRef}
                      onScroll={handlePickerScroll}
                      style={{ maskImage, WebkitMaskImage: maskImage }}
                      className="grid max-h-[112px] snap-y snap-proximity grid-cols-8 gap-1 overflow-y-auto scroll-p-1 p-1 pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {AVATAR_OPTIONS.map(({ key, Icon, label }) => (
                  <button
                    key={key}
                    type="button"
                    aria-label={label}
                    title={label}
                    onClick={() => setAvatar(key)}
                    className={`flex h-8 w-8 snap-start items-center justify-center rounded-lg transition-all ${
                      AVATAR_COLORS[key] ?? "text-stone-400"
                    } ${
                      avatar === key
                        ? "scale-105 bg-ink-black/5 ring-2 ring-current dark:bg-rice-white/10"
                        : "opacity-70 hover:bg-ink-black/5 hover:opacity-100 dark:hover:bg-rice-white/10"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                      ))}
                    </div>
                    {/* 右侧迷你进度条：轨道 + 按滚动位置移动的滑块 */}
                    <div className="pointer-events-none absolute bottom-1 right-0 top-1 w-[3px] rounded-full bg-ink-black/10 dark:bg-rice-white/15">
                      <div
                        className="absolute left-0 w-full rounded-full bg-ink-black/35 transition-[top] duration-75 dark:bg-rice-white/40"
                        style={{
                          height: `${pickerScroll.thumbRatio * 100}%`,
                          top: `${pickerScroll.progress * (1 - pickerScroll.thumbRatio) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>

            {submitError && (
              <p className="text-xs text-accent-dark dark:text-accent-light">
                {submitError}
              </p>
            )}
            {submitOk && (
              <p className="text-xs text-green-700 dark:text-green-400">
                已贴上留言墙，感谢你的足迹 ✦
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !isSupabaseConfigured}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-black py-2.5 text-sm font-medium text-rice-white transition-all hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-rice-white dark:text-ink-black"
            >
              <FiSend className="h-4 w-4" />
              {submitting ? "张贴中..." : "贴上便签"}
            </button>
          </form>
        </motion.section>
      </div>
    </main>
  );
}
