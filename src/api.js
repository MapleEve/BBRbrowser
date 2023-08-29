import { startCase } from "lodash";

export const serverListKeys = {
  name: "Name",
  map: "Map",
  mapSize: "MapSize",
  gamemode: "Gamemode",
  region: "Region",
  players: "Players",
  queuePlayers: "QueuePlayers",
  maxPlayers: "MaxPlayers",
  hz: "Hz",
  dayNight: "DayNight",
  isOfficial: "IsOfficial",
  hasPassword: "HasPassword",
  antiCheat: "AntiCheat",
  build: "Build",
  // added keys
  key: "key",
  playersStatus: "PlayersStatus",
  statusColor: "statusColor",
};

export async function fetchServerList() {
  const response = await fetch(
    "https://publicapi.battlebit.cloud/Servers/GetServerList"
  );
  const data = await response.json();
  const gamemodeMapping = {
    DOMI: "抢攻",
    CONQ: "征服",
    RUSH: "突破",
    FRONTLINE: "前线",
    CashRun: "运钞",
    INFCONQ: "步兵征服",
    TDM: "团队死斗",
    GunGameFFA: "个人军备竞赛",
    GunGameTeam: "团队军备竞赛",
    FFA:"个人死斗",
    ELI:"歼灭",
    CatchGame:"躲猫猫",
    SuicideRush:"自杀式突破",
    Infected:"感染",
    CaptureTheFlag:"夺旗",
    VoxelFortify:"方块防御",
  };
  const mapsizeMapping = {
    Tiny: "16",
    Small: "32",
    Medium: "64",
    Big: "128",
    Ultra: "254",
  };
  const flagMapping = {
    america: "🇺🇸",
    australia: "🇦🇺",
    brazil: "🇧🇷",
    europe: "🇪🇺",
    japan: "🇯🇵",
    africa:"🇿🇦",
    asia: "🌏",
    developer:"🧑🏻‍💻",
  };
  const regionCounts = {};

  data.forEach((server) => {
    server.key = `${server.Name}_${server.Region}_${server.Map}`;

    // bool转换器
    server.IsOfficial = server.Name.match(/\w{1,3}\-\w{1,2}\-\w{1,3}/) ? "官方服" : "社区服";
    server.HasPassword = server.HasPassword ? "私密" : "开放";

    // 服务器状态展示
    server.PlayersStatus =
      server.QueuePlayers > 0
        ? `${server.Players}[+${server.QueuePlayers}]/${server.MaxPlayers}`
        : `${server.Players}/${server.MaxPlayers}`;

    // 服务器数据颜色渲染判断
    if (server.Players + server.QueuePlayers === server.MaxPlayers) {
      server.statusColor = "magenta";
    } else if (server.Players + server.QueuePlayers >= server.MaxPlayers * 0.85) {
      server.statusColor = "red";
    } else if (server.Players + server.QueuePlayers >= server.MaxPlayers * 0.70) {
      server.statusColor = "orange";
    } else if (server.Players + server.QueuePlayers >= server.MaxPlayers * 0.50) {
      server.statusColor = "green";
    } else if (server.Players + server.QueuePlayers >= server.MaxPlayers * 0.25) {
      server.statusColor = "blue";
    } else {
      server.statusColor = "";
    }

    // 游戏模式转换
    Object.keys(gamemodeMapping).forEach((key) => {
      if (String(server.Gamemode).toLowerCase() === key.toLowerCase()) {
        server.Gamemode = gamemodeMapping[key];
      }
    });
    // 地图大小转换
    Object.keys(mapsizeMapping).forEach((key) => {
      if (String(server.mapSize).toLowerCase() === key.toLowerCase()) {
        server.mapSize = mapsizeMapping[key];
      }
    });

    // 调整地图名称 TODO 地图名称换行加中文mapping
    server.Map = startCase(server.Map);

    // 服务器旗帜替换值
    Object.keys(flagMapping).forEach((key) => {
      if (String(server.Region).toLowerCase().includes(key)) {
        server.Region = flagMapping[key] + " " + startCase(server.Region);
      }
    });

    // 日夜替换值
    if (server.DayNight.toLowerCase() === "day") {
      server.DayNight = "☀️ 白天";
    } else if (server.DayNight.toLowerCase() === "night") {
      server.DayNight = "🌙 夜晚";
    }

    // 有密码的替换值
    if (server.HasPassword === "私密") {
      server.HasPassword = "🔒 " + server.HasPassword;
    }

    // 计算区服内玩家的总数
    const totalPlayers = server.Players + server.QueuePlayers;
    if (regionCounts[server.Region]) {
        regionCounts[server.Region] += totalPlayers;
    } else {
        regionCounts[server.Region] = totalPlayers;
    }
  });
  const res = {
    data,
    regionCounts
  }

  return res;
}
